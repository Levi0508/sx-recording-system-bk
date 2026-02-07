import { Injectable, Logger } from '@nestjs/common';
import { AnalysisTaskService } from './analysis-task.service';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';

@Injectable()
export class AnalysisWorker {
  private readonly logger = new Logger(AnalysisWorker.name);
  private isRunning = false;
  private readonly POLLING_INTERVAL_MS = 2000; // 空闲时轮询间隔
  private readonly ANALYSIS_VERSION = 'v1.0.0-stub'; // 当前分析逻辑版本

  constructor(private readonly analysisTaskService: AnalysisTaskService) {}

  /**
   * 启动 Worker 循环
   */
  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.logger.log('🚀 Analysis Worker started. Waiting for tasks...');
    try {
      await this.analysisTaskService.ensureTableExists();
      this.logger.log('Analysis task table ensured.');
    } catch (e) {
      this.logger.error('ensureTableExists failed', e);
      throw e;
    }
    console.log('[Worker] 任务循环已启动，每 2 秒轮询一次 pending 任务');

    while (this.isRunning) {
      try {
        const processed = await this.processNext();
        if (!processed) {
          await this.sleep(this.POLLING_INTERVAL_MS);
        }
      } catch (e) {
        this.logger.error('Worker loop error:', e);
        console.error('[Worker] 循环异常:', e);
        await this.sleep(this.POLLING_INTERVAL_MS);
      }
    }
    console.log('[Worker] 任务循环已退出');
  }

  stop() {
    this.isRunning = false;
    this.logger.log('Analysis Worker stopping...');
  }

  private async processNext(): Promise<boolean> {
    // 1. 原子性抢任务
    let task: AnalysisTaskEntity | null = null;
    try {
      task = await this.analysisTaskService.fetchOnePendingAndLock();
    } catch (e) {
      this.logger.error('Failed to fetch task', e);
      return false;
    }

    if (!task) return false;

    this.logger.log(`Locked task ${task.id} (session: ${task.sessionId}). Processing...`);
    console.log(`[Worker] 抢到任务 id=${task.id} sessionId=${task.sessionId}，开始分析...`);

    try {
      // 2. 执行分析逻辑
      const result = await this.runAnalysis(task.sessionId);

      // 3. 完成并写入结果
      await this.analysisTaskService.completeTask(task.sessionId, result, this.ANALYSIS_VERSION);
      this.logger.log(`Task ${task.id} completed.`);
      console.log(`[Worker] 任务 id=${task.id} 已完成，结果已写入数据库`);
    } catch (e: any) {
      this.logger.error(`Task ${task.id} failed:`, e);
      console.error(`[Worker] 任务 id=${task.id} 失败:`, e?.message || e);
      await this.analysisTaskService.failTask(task.sessionId, e.message || 'Unknown error');
    }

    return true;
  }

  private async runAnalysis(sessionId: string): Promise<any> {
    // 模拟耗时操作 (1-3秒)
    await this.sleep(1000 + Math.random() * 2000);

    return {
      summary: '本次讲解覆盖了核心功能点，话术规范。',
      score: 95,
      risk_flags: [],
      keywords: ['生长激素', '每日注射', '冷藏保存'],
      processed_at: new Date().toISOString(),
    };
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
