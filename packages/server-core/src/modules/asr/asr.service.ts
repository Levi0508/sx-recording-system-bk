import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as PopCore from '@alicloud/pop-core';

// 兼容 CommonJS 导出
const RPCClient =
  (PopCore as any).RPCClient || (PopCore as any).default || PopCore;

/**
 * 阿里云智能语音交互 - 录音文件识别
 * 文档：https://help.aliyun.com/zh/isi/developer-reference/api-reference-2
 * 端点：filetrans.cn-shanghai.aliyuncs.com，支持单文件 file_link
 */
@Injectable()
export class AsrService {
  private readonly logger = new Logger(AsrService.name);
  private client: any;

  constructor(private readonly config: ConfigService) {
    this.client = new RPCClient({
      accessKeyId: this.config.get<string>('ALIYUN_AK_ID') || '',
      accessKeySecret: this.config.get<string>('ALIYUN_AK_SECRET') || '',
      endpoint: 'https://filetrans.cn-shanghai.aliyuncs.com',
      apiVersion: '2018-08-17',
    });
  }

  /**
   * 将多个音频 URL 依次转写并拼接为完整文本（每个 URL 单独提交任务）
   */
  async transcribe(audioUrls: string[]): Promise<string> {
    if (!audioUrls || audioUrls.length === 0) return '';

    this.logger.log(`Starting ASR for ${audioUrls.length} chunks...`);

    const parts: string[] = [];
    for (let i = 0; i < audioUrls.length; i++) {
      const url = audioUrls[i];
      try {
        const taskId = await this.submitOneTask(url);
        const text = await this.pollOneResult(taskId);
        if (text) parts.push(text);
      } catch (e: any) {
        this.logger.error(`Chunk ${i} ASR failed: ${e?.message || e}`);
        // 单段失败不抛错，继续下一段，最终返回已识别部分
      }
    }

    const full = parts.join('');
    this.logger.log(`ASR completed. Total length: ${full.length}`);
    return full;
  }

  /**
   * 提交单条录音文件识别请求
   */
  private async submitOneTask(fileLink: string): Promise<string> {
    const appKey = this.config.get<string>('ALI_ASR_APP_KEY');
    if (!appKey) throw new Error('Missing ALI_ASR_APP_KEY');

    // 任务元数据（version 4.0 下可开启大于 16kHz 自动降采样，客户端可继续用高质量录音）
    const task = {
      appkey: appKey,
      file_link: fileLink,
      version: '4.0',
      enable_words: false,
      enable_sample_rate_adaptive: true,
    };

    // 算法与业务参数（提高识别质量）
    const parameters = {
      format: 'm4a', // 明确指定格式，避免自动探测失败
      // sample_rate: 16000, // 不强制指定采样率，让 ASR 服务根据文件头自动识别/重采样，避免因源文件不是 16k 导致 UNSUPPORTED_SAMPLE_RATE
      enable_punctuation_prediction: true,
      enable_inverse_text_normalization: true,
      enable_voice_detection: true,
    };

    const response: any = await this.client.request(
      'SubmitTask',
      {
        Task: JSON.stringify(task),
        Parameters: JSON.stringify(parameters),
      },
      { method: 'POST' },
    );

    // 兼容解析 Status
    const status =
      response.StatusText || response.Status || response.Result?.Status;

    if (status !== 'SUCCESS') {
      this.logger.error(
        'SubmitTask failed response:',
        JSON.stringify(response),
      );
      throw new Error(
        `SubmitTask failed: ${status} ${response.StatusCode || ''} ${response.Message || ''}`,
      );
    }

    const taskId = response.TaskId;
    if (!taskId) throw new Error('SubmitTask response missing TaskId');
    return taskId;
  }

  /**
   * 轮询单任务结果直至 SUCCESS / 失败 / 超时
   */
  private async pollOneResult(taskId: string): Promise<string> {
    const POLL_INTERVAL_MS = 2000;
    const MAX_RETRIES = 300; // 约 10 分钟

    for (let i = 0; i < MAX_RETRIES; i++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

      const response: any = await this.client.request('GetTaskResult', {
        TaskId: taskId,
      });

      // 兼容解析 Status
      const status =
        response.StatusText || response.Status || response.Result?.Status;

      if (status === 'SUCCESS' || status === 'SUCCESS_WITH_NO_VALID_FRAGMENT') {
        return this.mergeResult(response.Result);
      }

      if (
        status === 'FILE_DOWNLOAD_FAILED' ||
        status === 'FILE_CHECK_FAILED' ||
        (response.StatusCode && response.StatusCode >= 40000000)
      ) {
        this.logger.error(
          `Task ${taskId} failed response:`,
          JSON.stringify(response),
        );
        throw new Error(
          `Task failed: ${status} ${response.StatusCode || ''} ${response.Message || ''}`,
        );
      }

      if (i % 5 === 0) {
        this.logger.debug(`ASR Task ${taskId} status: ${status}`);
      }
    }
    throw new Error('ASR Task timeout');
  }

  private mergeResult(result: any): string {
    if (!result) return '';
    // 兼容大小写
    const sentences = result.Sentences || result.sentences || [];
    return sentences.map((s: any) => s.Text || '').join('');
  }
}
