import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';

@Injectable()
export class AnalysisTaskService {
  constructor(
    @InjectRepository(AnalysisTaskEntity)
    private readonly taskRepo: Repository<AnalysisTaskEntity>,
  ) {}

  private getTableName(): string {
    const prefix =
      (this.taskRepo.manager.connection.options as any).entityPrefix ?? '';
    return `${prefix}recording_analysis_task`;
  }

  /** Worker 启动时调用：若表不存在则创建（幂等），转写/分析两态，结果在 recording_analysis_record */
  async ensureTableExists(): Promise<void> {
    const tableName = this.getTableName();
    await this.taskRepo.manager.query(`
      CREATE TABLE IF NOT EXISTS \`${tableName}\` (
        id INT PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3) NULL,
        session_id VARCHAR(64) NOT NULL,
        transcript_status VARCHAR(32) NOT NULL DEFAULT 'pending',
        transcript_error_message VARCHAR(512) NULL,
        analysis_status VARCHAR(32) NOT NULL DEFAULT 'pending',
        analysis_error_message VARCHAR(512) NULL,
        UNIQUE KEY uk_session_id (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  }

  /**
   * 为已完成录音的会话创建分析任务（幂等：已存在则直接返回）
   */
  async createTask(sessionId: string): Promise<AnalysisTaskEntity> {
    let task = await this.taskRepo.findOneBy({ sessionId });
    if (!task) {
      task = this.taskRepo.create({
        sessionId,
        transcriptStatus: 'pending',
        analysisStatus: 'pending',
      });
      await this.taskRepo.save(task);
    }
    return task;
  }

  /**
   * 按会话 ID 查询分析任务状态与结果
   */
  async getBySessionId(sessionId: string): Promise<AnalysisTaskEntity | null> {
    return this.taskRepo.findOneBy({ sessionId });
  }

  /**
   * Worker 专用：原子性地获取一个待处理任务并锁定（转写 pending → processing）
   */
  async fetchOnePendingAndLock(): Promise<AnalysisTaskEntity | null> {
    return this.taskRepo.manager.transaction(async (manager) => {
      const tableName = this.getTableName();
      const tasks = await manager.query(
        `SELECT * FROM \`${tableName}\` WHERE transcript_status = 'pending' AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED`,
      );
      if (tasks.length === 0) return null;
      const task = await manager.findOneBy(AnalysisTaskEntity, {
        id: tasks[0].id,
      });
      if (!task) return null;
      task.transcriptStatus = 'processing';
      await manager.save(task);
      return task;
    });
  }

  /** 转写完成后：转写 completed，分析 pending（由分析 Worker 抢单） */
  async setTranscriptDone(sessionId: string): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.transcriptStatus = 'completed';
      task.transcriptErrorMessage = undefined;
      task.analysisStatus = 'pending';
      await this.taskRepo.save(task);
    }
  }

  /**
   * 分析 Worker 专用：原子性地获取一个待分析任务并锁定（分析 pending → processing）
   * 条件：转写已完成且分析待处理
   */
  async fetchOnePendingAnalysisAndLock(): Promise<AnalysisTaskEntity | null> {
    return this.taskRepo.manager.transaction(async (manager) => {
      const tableName = this.getTableName();
      const tasks = await manager.query(
        `SELECT * FROM \`${tableName}\` WHERE transcript_status = 'completed' AND analysis_status = 'pending' AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED`,
      );
      if (tasks.length === 0) return null;
      const task = await manager.findOneBy(AnalysisTaskEntity, {
        id: tasks[0].id,
      });
      if (!task) return null;
      task.analysisStatus = 'processing';
      await manager.save(task);
      return task;
    });
  }

  /** 转写+分析均完成后调用 */
  async completeTask(sessionId: string): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.transcriptStatus = 'completed';
      task.transcriptErrorMessage = undefined;
      task.analysisStatus = 'completed';
      task.analysisErrorMessage = undefined;
      await this.taskRepo.save(task);
    }
  }

  /** 转写（ASR）失败时调用 */
  async failTranscriptTask(sessionId: string, error: string): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.transcriptStatus = 'failed';
      task.transcriptErrorMessage =
        error && error.length > 500 ? error.slice(0, 497) + '...' : error;
      await this.taskRepo.save(task);
    }
  }

  /** 智能体分析失败时调用 */
  async failAnalysisTask(sessionId: string, error: string): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.analysisStatus = 'failed';
      task.analysisErrorMessage =
        error && error.length > 500 ? error.slice(0, 497) + '...' : error;
      await this.taskRepo.save(task);
    }
  }
}
