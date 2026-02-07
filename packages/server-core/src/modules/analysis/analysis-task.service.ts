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

  /** Worker 启动时调用：若表不存在则创建（幂等），结果只存 result_oss_key */
  async ensureTableExists(): Promise<void> {
    const tableName = this.getTableName();
    await this.taskRepo.manager.query(`
      CREATE TABLE IF NOT EXISTS \`${tableName}\` (
        id INT PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3) NULL,
        session_id VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        version VARCHAR(64) NULL,
        result_oss_key VARCHAR(512) NULL,
        error_message VARCHAR(512) NULL,
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
        status: 'pending',
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
   * Worker 专用：原子性地获取一个待处理任务并锁定（标记为 processing）
   * 使用事务 + FOR UPDATE SKIP LOCKED 防止并发冲突
   */
  async fetchOnePendingAndLock(): Promise<AnalysisTaskEntity | null> {
    return this.taskRepo.manager.transaction(async (manager) => {
      // 1. 查找一个 pending 任务并锁定行（跳过已被锁定的）
      const tableName = this.getTableName();
      const tasks = await manager.query(
        `SELECT * FROM \`${tableName}\` WHERE status = 'pending' AND deleted_at IS NULL ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED`,
      );

      if (tasks.length === 0) return null;
      const taskRaw = tasks[0];

      // 获取实体以进行后续操作
      const task = await manager.findOneBy(AnalysisTaskEntity, {
        id: taskRaw.id,
      });
      if (!task) return null;

      // 2. 标记为 processing 并更新时间
      task.status = 'processing';
      await manager.save(task);

      return task;
    });
  }

  /**
   * 完成任务：结果已存 OSS，只写 result_oss_key 与版本号（方案 B）
   */
  async completeTask(
    sessionId: string,
    resultOssKey: string,
    version: string,
  ): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.status = 'completed';
      task.resultOssKey = resultOssKey;
      task.version = version;
      task.errorMessage = undefined;
      await this.taskRepo.save(task);
    }
  }

  /**
   * 标记任务失败（error_message 截断至 500 字符，避免超出 varchar(512)）
   */
  async failTask(sessionId: string, error: string): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.status = 'failed';
      task.errorMessage =
        error && error.length > 500 ? error.slice(0, 497) + '...' : error;
      await this.taskRepo.save(task);
    }
  }
}
