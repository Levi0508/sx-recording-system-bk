import { Injectable, Logger } from '@nestjs/common';
import { AnalysisTaskService } from './analysis-task.service';
import { AnalysisRecordService } from './analysis-record.service';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';
import { RecordingOssService } from '../recording/recording-oss.service';
import { BailianService } from '../bailian/bailian.service';

/**
 * 分析 Worker：只做「待分析」任务，读最新转写 → 百炼分析 → 写 analysis_record
 */
@Injectable()
export class AnalysisWorker {
  private readonly logger = new Logger(AnalysisWorker.name);
  private isRunning = false;
  private readonly POLLING_INTERVAL_MS = 2000;

  constructor(
    private readonly analysisTaskService: AnalysisTaskService,
    private readonly analysisRecordService: AnalysisRecordService,
    private readonly recordingOssService: RecordingOssService,
    private readonly bailianService: BailianService,
  ) {}

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.logger.log('🚀 Analysis Worker started. Waiting for tasks...');
    try {
      await this.analysisTaskService.ensureTableExists();
      await this.analysisRecordService.ensureTablesExist();
      this.logger.log('Analysis Worker: task & record tables ensured.');
    } catch (e) {
      this.logger.error('ensureTableExists failed', e);
      throw e;
    }
    console.log(
      '[AnalysisWorker] 分析任务循环已启动，每 2 秒轮询一次待分析任务',
    );

    while (this.isRunning) {
      try {
        const processed = await this.processNext();
        if (!processed) {
          await this.sleep(this.POLLING_INTERVAL_MS);
        }
      } catch (e) {
        this.logger.error('AnalysisWorker loop error:', e);
        console.error('[AnalysisWorker] 循环异常:', e);
        await this.sleep(this.POLLING_INTERVAL_MS);
      }
    }
    console.log('[AnalysisWorker] 分析任务循环已退出');
  }

  stop() {
    this.isRunning = false;
    this.logger.log('Analysis Worker stopping...');
  }

  private async processNext(): Promise<boolean> {
    let task: AnalysisTaskEntity | null = null;
    try {
      task = await this.analysisTaskService.fetchOnePendingAnalysisAndLock();
    } catch (e) {
      this.logger.error('Failed to fetch analysis task', e);
      return false;
    }

    if (!task) return false;

    const sessionId = task.sessionId;
    this.logger.log(
      `Locked analysis task ${task.id} (session: ${sessionId}). Running Bailian...`,
    );
    console.log(
      `[AnalysisWorker] 抢到分析任务 id=${task.id} sessionId=${sessionId}，开始智能体分析...`,
    );

    try {
      const transcriptRecord =
        await this.analysisRecordService.getLatestTranscriptRecordBySession(
          sessionId,
        );
      if (!transcriptRecord?.transcriptOssKey) {
        throw new Error('No transcript record or OSS key for session');
      }
      const rawBuf = await this.recordingOssService.getObjectContent(
        transcriptRecord.transcriptOssKey,
      );
      const raw = JSON.parse(rawBuf.toString('utf-8')) as {
        full_transcript?: string;
      };
      const transcript = raw?.full_transcript ?? '';
      if (!transcript.trim()) {
        throw new Error('Transcript content is empty');
      }

      const analysisResult = await this.runAnalysisStep(transcript);
      const analysisRecord =
        await this.analysisRecordService.createAnalysisRecord(
          sessionId,
          transcriptRecord.id,
          'worker',
        );
      const resultOssKey =
        await this.recordingOssService.uploadAnalysisResultRecord(
          sessionId,
          analysisRecord.id,
          analysisResult,
        );
      await this.analysisRecordService.setAnalysisResultOssKey(
        analysisRecord.id,
        resultOssKey,
      );
      await this.analysisTaskService.completeTask(sessionId);
      this.logger.log(`Task ${task.id} analysis completed.`);
      console.log(`[AnalysisWorker] 任务 id=${task.id} 智能体分析已完成`);
    } catch (e: any) {
      this.logger.error(`Task ${task.id} analysis failed:`, e);
      console.error(
        `[AnalysisWorker] 任务 id=${task.id} 分析失败:`,
        e?.message || e,
      );
      await this.analysisTaskService.failAnalysisTask(
        sessionId,
        e?.message || 'Unknown error',
      );
    }

    return true;
  }

  private async runAnalysisStep(
    transcript: string,
  ): Promise<Record<string, unknown>> {
    this.logger.log('Running Bailian analysis...');
    const agentResult = await this.bailianService.analyze(transcript);
    this.logger.log('Bailian analysis completed');
    return {
      step: 'analysis_complete',
      summary: agentResult.summary ?? '',
      score: agentResult.score ?? 0,
      risk_flags: agentResult.risk_flags ?? [],
      keywords: agentResult.keywords ?? [],
      suggestion: agentResult.suggestion,
      processed_at: new Date().toISOString(),
      ...agentResult,
    };
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
