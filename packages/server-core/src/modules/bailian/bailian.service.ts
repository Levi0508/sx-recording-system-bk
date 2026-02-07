import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DASHSCOPE_BASE = 'https://dashscope.aliyuncs.com';

/**
 * 阿里云百炼应用调用（DashScope 应用 completion API）
 * 文档：https://help.aliyun.com/zh/model-studio/application-calling-guide
 */
@Injectable()
export class BailianService {
  private readonly logger = new Logger(BailianService.name);

  constructor(private readonly config: ConfigService) {}

  /**
   * 调用百炼智能体分析录音转写文本，返回结构化结果
   * 应用在百炼控制台需配置为：输入转写文本，输出 JSON（summary、score、risk_flags、keywords 等）
   */
  async analyze(transcript: string): Promise<{
    summary?: string;
    score?: number;
    risk_flags?: string[];
    keywords?: string[];
    suggestion?: string;
    [key: string]: unknown;
  }> {
    const apiKey = this.config.get<string>('DASHSCOPE_API_KEY');
    const appId = this.config.get<string>('BAILIAN_APP_ID');
    if (!apiKey || !appId) {
      throw new Error('Missing DASHSCOPE_API_KEY or BAILIAN_APP_ID');
    }

    const url = `${DASHSCOPE_BASE}/api/v1/apps/${appId}/completion`;
    const body = {
      input: { prompt: transcript },
      parameters: {},
      debug: {},
    };

    this.logger.log(
      `Calling Bailian app ${appId}, transcript length: ${transcript.length}`,
    );

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      this.logger.error(`Bailian API error: ${res.status} ${errText}`);
      throw new Error(
        `Bailian API failed: ${res.status} ${errText.slice(0, 200)}`,
      );
    }

    const data = (await res.json()) as {
      output?: { text?: string };
      message?: string;
    };

    const text = data?.output?.text?.trim();
    if (!text) {
      this.logger.warn('Bailian returned empty text');
      return { summary: '', score: 0, risk_flags: [], keywords: [] };
    }

    return this.parseAnalysisOutput(text);
  }

  /**
   * 解析应用返回的文本为 JSON；若为纯 JSON 则直接解析，否则尝试提取 JSON 块
   */
  private parseAnalysisOutput(text: string): Record<string, unknown> {
    try {
      // 尝试直接解析
      const parsed = JSON.parse(text) as Record<string, unknown>;
      return this.normalizeAnalysisResult(parsed);
    } catch {
      // 尝试提取 ```json ... ``` 或 {...}
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
          return this.normalizeAnalysisResult(parsed);
        } catch (e) {
          this.logger.warn('Failed to parse JSON from Bailian output', e);
        }
      }
      return {
        summary: text.slice(0, 500),
        score: 0,
        risk_flags: [],
        keywords: [],
      };
    }
  }

  private normalizeAnalysisResult(
    parsed: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      risk_flags: Array.isArray(parsed.risk_flags) ? parsed.risk_flags : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      suggestion:
        typeof parsed.suggestion === 'string' ? parsed.suggestion : undefined,
      ...parsed,
    };
  }
}
