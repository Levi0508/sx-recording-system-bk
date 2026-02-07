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
  async getBySessionId(
    sessionId: string,
  ): Promise<AnalysisTaskEntity | null> {
    return this.taskRepo.findOneBy({ sessionId });
  }

  /**
   * Worker 专用：原子性地获取一个待处理任务并锁定（标记为 processing）
   * 使用事务 + FOR UPDATE SKIP LOCKED 防止并发冲突
   */
  async fetchOnePendingAndLock(): Promise<AnalysisTaskEntity | null> {
    return this.taskRepo.manager.transaction(async (manager) => {
      // 1. 查找一个 pending 任务并锁定行（跳过已被锁定的）
      const tasks = await manager.query(
        `SELECT * FROM analysis_task WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED`
      );

      if (tasks.length === 0) return null;
      const taskRaw = tasks[0];
      
      // 获取实体以进行后续操作
      const task = await manager.findOneBy(AnalysisTaskEntity, { id: taskRaw.id });
      if (!task) return null;

      // 2. 标记为 processing 并更新时间
      task.status = 'processing';
      await manager.save(task);

      return task;
    });
  }

  /**
   * 完成任务：写入结果与版本号
   */
  async completeTask(
    sessionId: string,
    result: any,
    version: string,
  ): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.status = 'completed';
      task.result = JSON.stringify(result);
      task.version = version;
      task.errorMessage = undefined;
      await this.taskRepo.save(task);
    }
  }

  /**
   * 标记任务失败
   */
  async failTask(sessionId: string, error: string): Promise<void> {
    const task = await this.taskRepo.findOneBy({ sessionId });
    if (task) {
      task.status = 'failed';
      task.errorMessage = error;
      await this.taskRepo.save(task);
    }
  }
}
