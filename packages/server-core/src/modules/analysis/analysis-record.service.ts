import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranscriptRecordEntity } from './entities/transcript-record.entity';
import {
  AnalysisRecordEntity,
  AnalysisTriggerType,
} from './entities/analysis-record.entity';
import { TranscriptTriggerType } from './entities/transcript-record.entity';

@Injectable()
export class AnalysisRecordService {
  constructor(
    @InjectRepository(TranscriptRecordEntity)
    private readonly transcriptRepo: Repository<TranscriptRecordEntity>,
    @InjectRepository(AnalysisRecordEntity)
    private readonly analysisRepo: Repository<AnalysisRecordEntity>,
  ) {}

  private getTranscriptTableName(): string {
    const prefix =
      (this.transcriptRepo.manager.connection.options as any).entityPrefix ??
      '';
    return `${prefix}recording_transcript_record`;
  }

  private getAnalysisTableName(): string {
    const prefix =
      (this.analysisRepo.manager.connection.options as any).entityPrefix ?? '';
    return `${prefix}recording_analysis_record`;
  }

  /** 启动时若表不存在则创建（幂等） */
  async ensureTablesExist(): Promise<void> {
    const transcriptTable = this.getTranscriptTableName();
    const analysisTable = this.getAnalysisTableName();
    await this.transcriptRepo.manager.query(`
      CREATE TABLE IF NOT EXISTS \`${transcriptTable}\` (
        id INT PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3) NULL,
        session_id VARCHAR(64) NOT NULL,
        transcript_oss_key VARCHAR(512) NULL,
        trigger_type VARCHAR(32) NOT NULL DEFAULT 'worker',
        INDEX idx_session_created (session_id, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await this.analysisRepo.manager.query(`
      CREATE TABLE IF NOT EXISTS \`${analysisTable}\` (
        id INT PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3) NULL,
        session_id VARCHAR(64) NOT NULL,
        transcript_record_id INT NOT NULL,
        result_oss_key VARCHAR(512) NULL,
        trigger_type VARCHAR(32) NOT NULL DEFAULT 'worker',
        INDEX idx_session_created (session_id, created_at),
        INDEX idx_transcript_record_id (transcript_record_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  }

  /** 创建转写记录（先落库拿 id，再上传 OSS 并回写 transcript_oss_key） */
  async createTranscriptRecord(
    sessionId: string,
    triggerType: TranscriptTriggerType,
  ): Promise<TranscriptRecordEntity> {
    const record = this.transcriptRepo.create({
      sessionId,
      triggerType,
    });
    await this.transcriptRepo.save(record);
    return record;
  }

  /** 更新转写记录的 OSS key */
  async setTranscriptOssKey(
    id: number,
    transcriptOssKey: string,
  ): Promise<void> {
    await this.transcriptRepo.update(id, { transcriptOssKey });
  }

  /** 创建分析记录（先落库拿 id，再上传 OSS 并回写 result_oss_key） */
  async createAnalysisRecord(
    sessionId: string,
    transcriptRecordId: number,
    triggerType: AnalysisTriggerType,
  ): Promise<AnalysisRecordEntity> {
    const record = this.analysisRepo.create({
      sessionId,
      transcriptRecordId,
      triggerType,
    });
    await this.analysisRepo.save(record);
    return record;
  }

  /** 更新分析记录的 OSS key */
  async setAnalysisResultOssKey(
    id: number,
    resultOssKey: string,
  ): Promise<void> {
    await this.analysisRepo.update(id, { resultOssKey });
  }

  /** 按会话取最新一条分析记录（含关联的转写记录） */
  async getLatestAnalysisRecordBySession(
    sessionId: string,
  ): Promise<AnalysisRecordEntity | null> {
    return this.analysisRepo.findOne({
      where: { sessionId },
      relations: ['transcriptRecord'],
      order: { id: 'DESC' },
    });
  }

  /** 按 id 取转写记录 */
  async getTranscriptRecordById(
    id: number,
  ): Promise<TranscriptRecordEntity | null> {
    return this.transcriptRepo.findOneBy({ id });
  }

  /** 按会话查分析历史（含关联转写，按 id 倒序，用于联表查所有版本） */
  async listAnalysisHistoryBySession(
    sessionId: string,
  ): Promise<AnalysisRecordEntity[]> {
    return this.analysisRepo.find({
      where: { sessionId },
      relations: ['transcriptRecord'],
      order: { id: 'DESC' },
    });
  }

  /** 按会话取最新一条转写记录（用于 reanalyze 时读同一转写） */
  async getLatestTranscriptRecordBySession(
    sessionId: string,
  ): Promise<TranscriptRecordEntity | null> {
    return this.transcriptRepo.findOne({
      where: { sessionId },
      order: { id: 'DESC' },
    });
  }
}
