import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingSessionEntity } from './entities/recording-session.entity';
import { RecordingChunkEntity } from './entities/recording-chunk.entity';
import { CreateSessionDTO } from './dtos/create-session.dto';
import { UploadChunkDTO } from './dtos/upload-chunk.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RecordingService {
  // 定义录音文件基础存储路径 (建议配置化，这里先硬编码示例)
  // 使用 process.cwd() 确保是项目根目录下的 uploads
  private readonly UPLOAD_BASE_DIR = path.join(
    process.cwd(),
    'uploads',
    'recordings',
  );

  constructor(
    @InjectRepository(RecordingSessionEntity)
    private readonly sessionRepo: Repository<RecordingSessionEntity>,
    @InjectRepository(RecordingChunkEntity)
    private readonly chunkRepo: Repository<RecordingChunkEntity>,
  ) {
    // 确保上传目录存在
    if (!fs.existsSync(this.UPLOAD_BASE_DIR)) {
      fs.mkdirSync(this.UPLOAD_BASE_DIR, { recursive: true });
    }
  }

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

  async handleChunkUpload(dto: UploadChunkDTO, file: Express.Multer.File) {
    try {
      const { sessionId, chunkId, duration } = dto;
      console.log(
        'RecordingService->handleChunkUpload',
        `处理分片上传: session=${sessionId}, chunk=${chunkId}, tempFile=${file.path}`,
      );

      // 1. 确保 Session 目录存在
      const sessionDir = path.join(this.UPLOAD_BASE_DIR, sessionId!);
      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      // 2. 移动/保存文件
      const ext = path.extname(file.originalname) || '.m4a';
      const fileName = `chunk_${chunkId}${ext}`;
      const filePath = path.join(sessionDir, fileName);

      console.log(`目标路径: ${filePath}`);

      // 使用 copy + unlink 替代 rename，兼容性更好
      await fs.promises.copyFile(file.path, filePath);
      await fs.promises.unlink(file.path);

      console.log('文件移动成功');

      // 3. 记录/更新 Chunk 数据库状态
      let chunk = await this.chunkRepo.findOneBy({ sessionId, chunkId });
      if (!chunk) {
        chunk = new RecordingChunkEntity();
        chunk.sessionId = sessionId;
        chunk.chunkId = chunkId;
      }
      chunk.duration = duration;
      chunk.filePath = filePath;
      chunk.status = 'uploaded';

      await this.chunkRepo.save(chunk);
      console.log(
        'RecordingService->handleChunkUpload',

        `[handleChunkUpload] DB Saved: session=${sessionId}, chunk=${chunkId}`,
      );

      // 反查验证
      const savedChunk = await this.chunkRepo.findOneBy({ sessionId, chunkId });

      if (!savedChunk) {
        console.error(
          'RecordingService->handleChunkUpload',

          `[handleChunkUpload] CRITICAL ERROR: Data saved but not found immediately! session=${sessionId}, chunk=${chunkId}`,
        );
      } else {
        console.log(
          `[handleChunkUpload] Verification successful: status=${savedChunk.status}`,
        );
      }

      return { success: true, chunkId };
    } catch (error) {
      console.error('分片处理失败:', error);
      throw error; // 抛出异常让 Controller 捕获
    }
  }

  async completeSession(sessionId: string) {
    const session = await this.sessionRepo.findOneBy({ sessionId });
    if (session) {
      session.status = 'completed';
      // 计算总时长（可选：从 chunks 累加）
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

  // 获取服务端已有的 chunk IDs
  async getUploadedChunks(sessionId: string): Promise<number[]> {
    // 调试：先查该 sessionId 下的所有记录（不分状态）
    const allChunks = await this.chunkRepo.find({
      where: { sessionId },
    });
    console.log(
      `[Debug] Total chunks for session ${sessionId}: ${allChunks.length}`,
      allChunks.map((c) => ({ id: c.chunkId, status: c.status })),
    );

    const chunks = await this.chunkRepo.find({
      where: { sessionId, status: 'uploaded' },
      select: ['chunkId'],
    });
    return chunks.map((c) => c.chunkId!);
  }
}
