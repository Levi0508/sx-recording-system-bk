import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AsrService {
  private readonly logger = new Logger(AsrService.name);

  /**
   * 将音频文件转写为文本
   * @param audioUrls 音频文件的访问链接列表（按顺序）
   * @returns 转写后的完整文本
   */
  async transcribe(audioUrls: string[]): Promise<string> {
    this.logger.log(`Starting transcription for ${audioUrls.length} chunks...`);

    // TODO: 接入真实 ASR 服务 (如阿里云录音文件识别、OpenAI Whisper 等)
    // 真实场景下，可能需要：
    // 1. 下载所有分片并使用 ffmpeg 合并为一个文件
    // 2. 上传合并后的文件到 OSS
    // 3. 调用 ASR 接口提交任务并轮询结果

    // 模拟耗时
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.logger.log('Transcription completed (Mock).');

    // 返回模拟文本
    return `（模拟转写结果）
你好，我是生长激素药品的讲解员。
生长激素是一种蛋白质激素，主要用于治疗生长激素缺乏症。
使用时请注意，必须每天皮下注射一次，注射部位可以选择大腿前侧或腹部。
药品必须在2-8摄氏度冷藏保存，切记不可冷冻。
如果在注射过程中出现红肿，请立即停药并咨询医生。
我们会全程跟踪您的治疗效果，请放心使用。`;
  }
}
