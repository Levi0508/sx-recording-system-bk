import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { AnalysisTaskService } from './analysis-task.service';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';
import { RecordingService } from '../recording/recording.service';
import { RecordingOssService } from '../recording/recording-oss.service';
import { AsrService } from '../asr/asr.service';

@Injectable()
export class AnalysisWorker {
  private readonly logger = new Logger(AnalysisWorker.name);
  private isRunning = false;
  private readonly POLLING_INTERVAL_MS = 2000; // 空闲时轮询间隔
  private readonly ANALYSIS_VERSION = 'v1.0.0-mock-asr'; // 标记为含 Mock ASR 的版本

  constructor(
    private readonly analysisTaskService: AnalysisTaskService,
    @Inject(forwardRef(() => RecordingService))
    private readonly recordingService: RecordingService,
    private readonly recordingOssService: RecordingOssService,
    private readonly asrService: AsrService,
  ) {}

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

    this.logger.log(
      `Locked task ${task.id} (session: ${task.sessionId}). Processing...`,
    );
    console.log(
      `[Worker] 抢到任务 id=${task.id} sessionId=${task.sessionId}，开始分析...`,
    );

    try {
      // 2. 执行分析逻辑
      const result = await this.runAnalysis(task.sessionId);

      // 3. 完成并写入结果
      await this.analysisTaskService.completeTask(
        task.sessionId,
        result,
        this.ANALYSIS_VERSION,
      );
      this.logger.log(`Task ${task.id} completed.`);
      console.log(`[Worker] 任务 id=${task.id} 已完成，结果已写入数据库`);
    } catch (e: any) {
      this.logger.error(`Task ${task.id} failed:`, e);
      console.error(`[Worker] 任务 id=${task.id} 失败:`, e?.message || e);
      await this.analysisTaskService.failTask(
        task.sessionId,
        e.message || 'Unknown error',
      );
    }

    return true;
  }

  private async runAnalysis(sessionId: string): Promise<any> {
    this.logger.log(`Starting analysis for session ${sessionId}...`);

    // 1. 获取录音分片
    const chunks = await this.recordingService.getChunksWithOssKey(sessionId);
    if (!chunks || chunks.length === 0) {
      throw new Error(`Session ${sessionId} has no uploaded chunks.`);
    }

    // 2. 生成 OSS 访问链接
    // 注意：真实场景下如果是私有 Bucket，需要生成带签名的 URL；如果是公有读则直接拼接
    // 假设是私有 Bucket，使用 getSignUrlForPlay 生成临时 URL (有效期 1 小时)
    const audioUrls = chunks.map((chunk) => {
      if (!chunk.ossObjectKey) {
        throw new Error(`Chunk ${chunk.chunkId} has no ossObjectKey`);
      }
      // 生成带签名的 URL，供 ASR 服务下载
      return this.recordingOssService.getSignUrlForPlay(
        chunk.ossObjectKey,
        3600,
      );
    });

    this.logger.log(
      `Generated ${audioUrls.length} audio URLs for ASR. (First URL: ${audioUrls[0].substring(0, 50)}...)`,
    );

    // 3. 调用 ASR 服务获取文本
    // 这里目前是 Mock 实现，真实接入时替换 AsrService 内部逻辑即可
    const transcript = await this.asrService.transcribe(audioUrls);
    this.logger.log(`Transcription result length: ${transcript.length} chars`);

    // 4. (可选) 基于文本做进一步 NLP 分析 (关键字匹配、LLM 分析等)
    // 这里先做简单的关键字匹配作为示例
    const keywordsToLookFor = [
      '生长激素',
      '每日注射',
      '冷藏保存',
      '红肿',
      '医生',
    ];
    const foundKeywords = keywordsToLookFor.filter((k) =>
      transcript.includes(k),
    );

    return {
      step: 'analysis_complete',
      transcript_preview: transcript.substring(0, 100) + '...',
      full_transcript: transcript, // 实际存储时可能需要考虑字段长度，过长可存 OSS
      summary: '（由 ASR 生成的文本进行分析）本次讲解覆盖了核心功能点。',
      score: foundKeywords.length >= 3 ? 95 : 80, // 简单评分逻辑
      risk_flags: [],
      keywords: foundKeywords,
      chunk_count: chunks.length,
      processed_at: new Date().toISOString(),
    };
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
