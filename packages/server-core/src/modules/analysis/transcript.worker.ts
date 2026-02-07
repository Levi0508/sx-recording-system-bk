import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { AnalysisTaskService } from './analysis-task.service';
import { AnalysisRecordService } from './analysis-record.service';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';
import { RecordingService } from '../recording/recording.service';
import { RecordingOssService } from '../recording/recording-oss.service';
import { AsrService } from '../asr/asr.service';

/**
 * 转写 Worker：只做 ASR + 写 transcript_record，完成后任务进入「待分析」由分析 Worker 处理
 */
@Injectable()
export class TranscriptWorker {
  private readonly logger = new Logger(TranscriptWorker.name);
  private isRunning = false;
  private readonly POLLING_INTERVAL_MS = 2000;

  constructor(
    private readonly analysisTaskService: AnalysisTaskService,
    private readonly analysisRecordService: AnalysisRecordService,
    @Inject(forwardRef(() => RecordingService))
    private readonly recordingService: RecordingService,
    private readonly recordingOssService: RecordingOssService,
    private readonly asrService: AsrService,
  ) {}

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.logger.log('🚀 Transcript Worker started. Waiting for tasks...');
    try {
      await this.analysisTaskService.ensureTableExists();
      await this.analysisRecordService.ensureTablesExist();
      this.logger.log('Transcript Worker: task & record tables ensured.');
    } catch (e) {
      this.logger.error('ensureTableExists failed', e);
      throw e;
    }
    console.log(
      '[TranscriptWorker] 转写任务循环已启动，每 2 秒轮询一次待转写任务',
    );

    while (this.isRunning) {
      try {
        const processed = await this.processNext();
        if (!processed) {
          await this.sleep(this.POLLING_INTERVAL_MS);
        }
      } catch (e) {
        this.logger.error('TranscriptWorker loop error:', e);
        console.error('[TranscriptWorker] 循环异常:', e);
        await this.sleep(this.POLLING_INTERVAL_MS);
      }
    }
    console.log('[TranscriptWorker] 转写任务循环已退出');
  }

  stop() {
    this.isRunning = false;
    this.logger.log('Transcript Worker stopping...');
  }

  private async processNext(): Promise<boolean> {
    let task: AnalysisTaskEntity | null = null;
    try {
      task = await this.analysisTaskService.fetchOnePendingAndLock();
    } catch (e) {
      this.logger.error('Failed to fetch task', e);
      return false;
    }

    if (!task) return false;

    const sessionId = task.sessionId;
    this.logger.log(
      `Locked transcript task ${task.id} (session: ${sessionId}). Running ASR...`,
    );
    console.log(
      `[TranscriptWorker] 抢到转写任务 id=${task.id} sessionId=${sessionId}，开始 ASR...`,
    );

    try {
      const transcriptPayload = await this.runTranscription(sessionId);
      const transcriptRecord =
        await this.analysisRecordService.createTranscriptRecord(
          sessionId,
          'worker',
        );
      const transcriptOssKey =
        await this.recordingOssService.uploadTranscriptRecord(
          sessionId,
          transcriptRecord.id,
          transcriptPayload,
        );
      await this.analysisRecordService.setTranscriptOssKey(
        transcriptRecord.id,
        transcriptOssKey,
      );
      await this.analysisTaskService.setTranscriptDone(sessionId);
      this.logger.log(`Task ${task.id} transcript done, waiting for analysis.`);
      console.log(`[TranscriptWorker] 任务 id=${task.id} 转写已完成，已进入待分析队列`);
    } catch (e: any) {
      this.logger.error(`Task ${task.id} transcript failed:`, e);
      console.error(
        `[TranscriptWorker] 任务 id=${task.id} 转写失败:`,
        e?.message || e,
      );
      await this.analysisTaskService.failTranscriptTask(
        sessionId,
        e?.message || 'Unknown error',
      );
    }

    return true;
  }

  private async runTranscription(sessionId: string): Promise<{
    full_transcript: string;
    chunk_count: number;
    processed_at: string;
  }> {
    this.logger.log(`Starting transcription for session ${sessionId}...`);
    const chunks = await this.recordingService.getChunksWithOssKey(sessionId);
    if (!chunks || chunks.length === 0) {
      throw new Error(`Session ${sessionId} has no uploaded chunks.`);
    }
    const audioUrls = chunks.map((chunk) => {
      if (!chunk.ossObjectKey) {
        throw new Error(`Chunk ${chunk.chunkId} has no ossObjectKey`);
      }
      return this.recordingOssService.getSignUrlForPlay(
        chunk.ossObjectKey,
        3600,
      );
    });
    const transcript = await this.asrService.transcribe(audioUrls);
    this.logger.log(`Transcription result length: ${transcript.length} chars`);
    return {
      full_transcript: transcript,
      chunk_count: chunks.length,
      processed_at: new Date().toISOString(),
    };
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
