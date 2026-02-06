import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingSessionEntity } from './entities/recording-session.entity';
import { RecordingChunkEntity } from './entities/recording-chunk.entity';
import { CreateSessionDTO } from './dtos/create-session.dto';

@Injectable()
export class RecordingService {
  constructor(
    @InjectRepository(RecordingSessionEntity)
    private readonly sessionRepo: Repository<RecordingSessionEntity>,
    @InjectRepository(RecordingChunkEntity)
    private readonly chunkRepo: Repository<RecordingChunkEntity>,
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
   * 结束会话：将会话状态设为 completed，并汇总该会话下所有分片 duration 写入 totalDuration
   */
  async completeSession(sessionId: string) {
    const session = await this.sessionRepo.findOneBy({ sessionId });
    if (session) {
      session.status = 'completed';
      const { sum } = await this.chunkRepo
        .createQueryBuilder('chunk')
        .select('SUM(chunk.duration)', 'sum')
        .where('chunk.sessionId = :sessionId', { sessionId })
        .getRawOne();

      session.totalDuration = sum || 0;
      await this.sessionRepo.save(session);
    }
    return session;
  }

  /**
   * OSS 直传模式：前端上传完成后提交分片列表，后端落库并完成会话。
   * 若会话不存在则先创建，避免仅走 OSS 未调 createSession 时 complete 无效。
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
      chunk.status = 'uploaded';
      await this.chunkRepo.save(chunk);
    }
    return this.completeSession(sessionId);
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
