import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordingAnalysisTaskEntity } from './entities/recording-analysis-task.entity';

@Injectable()
export class AnalysisTaskService {
  constructor(
    @InjectRepository(RecordingAnalysisTaskEntity)
    private readonly taskRepo: Repository<RecordingAnalysisTaskEntity>,
  ) {}

  /**
   * 为已完成录音的会话创建分析任务（幂等：已存在则直接返回）
   * 供会话 complete 时调用，后续可由 Worker 消费 pending 任务
   */
  async createTask(sessionId: string): Promise<RecordingAnalysisTaskEntity> {
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
  ): Promise<RecordingAnalysisTaskEntity | null> {
    return this.taskRepo.findOneBy({ sessionId });
  }

  /**
   * Worker 专用：原子性地获取一个待处理任务并锁定（标记为 processing）
   * 使用事务 + FOR UPDATE SKIP LOCKED 防止并发冲突
   */
  async fetchOnePendingAndLock(): Promise<RecordingAnalysisTaskEntity | null> {
    return this.taskRepo.manager.transaction(async (manager) => {
      // 1. 查找一个 pending 任务并锁定行（跳过已被锁定的）
      const task = await manager
        .createQueryBuilder(RecordingAnalysisTaskEntity, 'task')
        .setLock('pessimistic_write')
        .where('task.status = :status', { status: 'pending' })
        .orderBy('task.created_at', 'ASC')
        .limit(1)
        .setOnLocked('skip_locked') // 关键：跳过被其他 Worker 锁定的行
        .getOne();

      if (!task) return null;

      // 2. 标记为 processing 并更新时间
      task.status = 'processing';
      // 注意：BaseEntity 的 updatedAt 会在 save 时自动更新，但为了业务明确，这里逻辑上是“开始处理”的时间点
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
