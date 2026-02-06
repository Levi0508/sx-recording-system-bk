import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingSessionEntity } from './entities/recording-session.entity';
import { RecordingChunkEntity } from './entities/recording-chunk.entity';
import { CreateSessionDTO } from './dtos/create-session.dto';
import { RecordingOssService } from './recording-oss.service';

@Injectable()
export class RecordingService {
  constructor(
    @InjectRepository(RecordingSessionEntity)
    private readonly sessionRepo: Repository<RecordingSessionEntity>,
    @InjectRepository(RecordingChunkEntity)
    private readonly chunkRepo: Repository<RecordingChunkEntity>,
    private readonly recordingOssService: RecordingOssService,
  ) {}

  /**
   * 创建录音会话（幂等：同一 sessionId 已存在则直接返回）
   * 写入 sessionId、clientName、startTime，状态为 recording
   */
  async createSession(dto: CreateSessionDTO) {
    // 幂等处理：如果已存在同名 sessionId，直接返回（或更新）
    let session = await this.sessionRepo.findOneBy({
      sessionId: dto.sessionId,
    });
    if (!session) {
      session = new RecordingSessionEntity();
      session.sessionId = dto.sessionId;
      session.clientName = dto.clientName || '';
      session.startTime = dto.startTime;
      session.status = 'recording';
      await this.sessionRepo.save(session);
    }
    return session;
  }

  /**
   * 结束会话：将会话状态设为 completed，并汇总该会话下已校验通过（status=uploaded）分片的 duration 写入 totalDuration
   */
  async completeSession(sessionId: string) {
    const session = await this.sessionRepo.findOneBy({ sessionId });
    if (session) {
      session.status = 'completed';
      const { sum } = await this.chunkRepo
        .createQueryBuilder('chunk')
        .select('SUM(chunk.duration)', 'sum')
        .where('chunk.sessionId = :sessionId', { sessionId })
        .andWhere('chunk.status = :status', { status: 'uploaded' })
        .getRawOne();

      session.totalDuration = sum || 0;
      await this.sessionRepo.save(session);
    }
    return session;
  }

  /**
   * OSS 直传模式：complete 时客户端上报全部 expectedFiles。
   * 对每个 objectKey 做 OSS head 校验：通过 → status=uploaded 落库；不通过（不存在/断网）→ status=pending 落库，留待补救。
   */
  async completeSessionWithOssChunks(
    sessionId: string,
    chunks: {
      chunkId: number;
      objectKey: string;
      size: number;
      duration: number;
    }[],
  ) {
    let session = await this.sessionRepo.findOneBy({ sessionId });
    if (!session) {
      session = new RecordingSessionEntity();
      session.sessionId = sessionId;
      session.status = 'recording';
      session.clientName = '';
      session.startTime = Date.now();
      await this.sessionRepo.save(session);
    }
    session.useOss = 1;
    await this.sessionRepo.save(session);

    for (const c of chunks) {
      let chunk = await this.chunkRepo.findOneBy({
        sessionId,
        chunkId: c.chunkId,
      });
      if (!chunk) {
        chunk = new RecordingChunkEntity();
        chunk.sessionId = sessionId;
        chunk.chunkId = c.chunkId;
      }
      chunk.ossObjectKey = c.objectKey;
      chunk.duration = c.duration;
      try {
        await this.recordingOssService.assertObjectExistsAndSize(
          c.objectKey,
          c.size,
        );
        chunk.status = 'uploaded';
      } catch {
        chunk.status = 'pending';
      }
      await this.chunkRepo.save(chunk);
    }
    return this.completeSession(sessionId);
  }

  /**
   * 补救：对某会话下所有 status=pending 的分片做 headObject，通过则改为 uploaded 并更新 totalDuration。
   * 用于网络恢复后，使“已在 OSS 但 complete 时未校验到”的文件落库。
   */
  async checkPendingChunks(sessionId: string): Promise<{ updated: number }> {
    const pending = await this.chunkRepo.find({
      where: { sessionId, status: 'pending' },
      select: ['chunkId', 'ossObjectKey', 'duration'],
    });
    if (pending.length === 0) return { updated: 0 };

    let updated = 0;
    for (const c of pending) {
      if (!c.ossObjectKey) continue;
      try {
        await this.recordingOssService.assertObjectExistsAndSize(
          c.ossObjectKey,
          undefined,
        );
        await this.chunkRepo.update(
          { sessionId, chunkId: c.chunkId },
          { status: 'uploaded' },
        );
        updated++;
      } catch {
        // 仍不可达，保持 pending
      }
    }
    if (updated > 0) {
      const session = await this.sessionRepo.findOneBy({ sessionId });
      if (session) {
        const { sum } = await this.chunkRepo
          .createQueryBuilder('chunk')
          .select('SUM(chunk.duration)', 'sum')
          .where('chunk.sessionId = :sessionId', { sessionId })
          .andWhere('chunk.status = :status', { status: 'uploaded' })
          .getRawOne();
        session.totalDuration = sum || 0;
        await this.sessionRepo.save(session);
      }
    }
    return { updated };
  }

  /**
   * 获取某会话已上传分片的 chunkId 列表
   * 用于前端断点续传：根据已存在的 chunkId 决定哪些分片需要重传或跳过
   */
  async getUploadedChunks(sessionId: string): Promise<number[]> {
    const chunks = await this.chunkRepo.find({
      where: { sessionId, status: 'uploaded' },
      select: ['chunkId'],
    });
    return chunks.map((c) => c.chunkId!);
  }

  /**
   * 已完成的会话列表（用于 Explore 例音）
   * @param limit 最多返回条数，默认 50
   * @returns 按 startTime 倒序的会话实体列表
   */
  async getCompletedSessions(limit: number = 50) {
    return this.sessionRepo.find({
      where: { status: 'completed' },
      order: { startTime: 'DESC' },
      take: limit,
    });
  }

  /**
   * 补传落库：会话已 completed 后，后续上传成功的分片通过此方法落库。
   * 对每个 chunk 做 OSS head 校验存在与 size，通过后写入 chunk 表并更新会话 totalDuration；不改变会话 status。
   */
  async appendChunks(
    sessionId: string,
    chunks: {
      chunkId: number;
      objectKey: string;
      size: number;
      duration: number;
    }[],
  ) {
    if (chunks.length === 0) return;
    for (const c of chunks) {
      await this.recordingOssService.assertObjectExistsAndSize(
        c.objectKey,
        c.size,
      );
    }
    const session = await this.sessionRepo.findOneBy({ sessionId });
    if (!session) {
      throw new Error('会话不存在');
    }

    for (const c of chunks) {
      let chunk = await this.chunkRepo.findOneBy({
        sessionId,
        chunkId: c.chunkId,
      });
      if (!chunk) {
        chunk = new RecordingChunkEntity();
        chunk.sessionId = sessionId;
        chunk.chunkId = c.chunkId;
      }
      chunk.ossObjectKey = c.objectKey;
      chunk.duration = c.duration;
      chunk.status = 'uploaded';
      await this.chunkRepo.save(chunk);
    }
    const { sum } = await this.chunkRepo
      .createQueryBuilder('chunk')
      .select('SUM(chunk.duration)', 'sum')
      .where('chunk.sessionId = :sessionId', { sessionId })
      .getRawOne();
    session.totalDuration = sum || 0;
    await this.sessionRepo.save(session);
  }

  /**
   * 某会话下所有已上传分片（含 oss_object_key、duration）
   * 按 chunkId 升序，供生成例音播放 URL 列表（GET play-urls）
   */
  async getChunksWithOssKey(sessionId: string) {
    return this.chunkRepo.find({
      where: { sessionId, status: 'uploaded' },
      select: ['chunkId', 'ossObjectKey', 'duration'],
      order: { chunkId: 'ASC' },
    });
  }
}
