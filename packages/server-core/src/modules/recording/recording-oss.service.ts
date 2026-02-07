/// <reference path="../../declarations/ali-oss.d.ts" />
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AliOSS from 'ali-oss';

// ali-oss 在 Node 下 ESM/CJS 互操作：default 可能不是 constructor，依次尝试 .OSS、.default、模块本身
const _m = AliOSS as any;
const OSSClient =
  typeof _m.OSS === 'function'
    ? _m.OSS
    : typeof _m.default === 'function'
      ? _m.default
      : _m;

/** 预签名上传返回 */
export interface PresignUploadResult {
  putUrl: string;
  objectKey: string;
  expiresAt: number;
}

/**
 * 录音文件 OSS 直传：生成预签名 PUT URL，路径规范
 * /recordings/{companyId}/{userId}/{sessionId}/chunk_{chunkId}.m4a
 *
 * 配置来源：在「运行 server-core 时的当前工作目录」下的 env/.env.local 中配置环境变量。
 * 若在 packages/server-core 下执行 pnpm start:dev，则配置文件为 packages/server-core/env/.env.local。
 * 所需变量见 env/.env.example 中的 OSS_* 项，值从阿里云 OSS 控制台获取（Bucket、地域、AccessKey）。
 */
@Injectable()
export class RecordingOssService {
  private client: InstanceType<typeof OSSClient> | null = null;

  constructor(private readonly config: ConfigService) {}

  /** 懒加载 OSS 客户端，从 ConfigService 读取 OSS_* 环境变量 */
  private getClient(): InstanceType<typeof OSSClient> {
    if (!this.client) {
      const region = this.config.get<string>('OSS_REGION');
      const bucket = this.config.get<string>('OSS_BUCKET');
      const accessKeyId = this.config.get<string>('OSS_ACCESS_KEY_ID');
      const accessKeySecret = this.config.get<string>('OSS_ACCESS_KEY_SECRET');
      if (!region || !bucket || !accessKeyId || !accessKeySecret) {
        throw new Error(
          'OSS config missing: OSS_REGION, OSS_BUCKET, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET',
        );
      }
      this.client = new OSSClient({
        region,
        bucket,
        accessKeyId,
        accessKeySecret,
      });
    }
    return this.client;
  }

  /**
   * 生成单个分片的预签名 PUT URL
   * 路径：recordings/{companyId}/{sessionId}/chunk_{chunkId}.m4a（不包含 userId）
   * @param _userId 保留参数，兼容 controller 调用，未参与路径
   * @param sessionId 录音会话 ID
   * @param chunkId 分片序号
   * @param expires 有效期（秒），默认 900（15 分钟）
   */
  getPresignPutUrl(
    _userId: number,
    sessionId: string,
    chunkId: number,
    expires: number = 900,
  ): PresignUploadResult {
    const companyId = this.config.get<string>('OSS_COMPANY_ID') || 'default';
    const objectKey = `recordings/${companyId}/${sessionId}/chunk_${chunkId}.m4a`;
    const client = this.getClient();
    const putUrl = client.signatureUrl(objectKey, {
      method: 'PUT',
      expires,
      'Content-Type': 'audio/mp4',
    });
    return {
      putUrl,
      objectKey,
      expiresAt: Math.floor(Date.now() / 1000) + expires,
    };
  }

  /**
   * 校验 OSS 对象是否存在，并可选校验大小（用于 complete 前可信校验）
   * @param objectKey OSS 对象键
   * @param expectedSize 期望的字节数，若传入则与 OSS 返回的 content-length 比对（一致才通过）
   * @returns 存在且大小一致时返回 { size }，不存在或大小不一致时抛错
   */
  async assertObjectExistsAndSize(
    objectKey: string,
    expectedSize?: number,
  ): Promise<{ size: number }> {
    const client = this.getClient();
    try {
      const result = await client.head(objectKey);
      const headers =
        result.res?.headers || result.res?.response?.headers || {};
      const contentLength =
        headers['content-length'] ?? headers['Content-Length'];
      const size =
        contentLength != null ? parseInt(String(contentLength), 10) : 0;
      if (
        expectedSize != null &&
        !Number.isNaN(expectedSize) &&
        size !== expectedSize
      ) {
        throw new Error(
          `OSS 对象大小不一致: objectKey=${objectKey}, 期望=${expectedSize}, 实际=${size}`,
        );
      }
      return { size };
    } catch (e: any) {
      const code = e?.code ?? e?.name;
      if (code === 'NoSuchKey' || e?.status === 404) {
        throw new Error(`OSS 对象不存在: ${objectKey}`);
      }
      throw e;
    }
  }

  /**
   * 生成 OSS 对象的临时读（播放）URL
   * 用于 Explore 例音播放、下载等需要临时访问私有对象的场景
   * @param objectKey OSS 对象键（如 recordings/default/{sessionId}/chunk_1.m4a）
   * @param expires 链接有效期（秒），默认 3600（1 小时）
   * @returns 带签名的 GET URL，前端可直接用于 Audio 播放或下载
   */
  getSignUrlForPlay(objectKey: string, expires: number = 3600): string {
    const client = this.getClient();
    return client.signatureUrl(objectKey, { method: 'GET', expires });
  }

  /** 获取 OSS 配置（前端直传时可选：bucket、region、pathPrefix 用于展示或 STS 模式） */
  getPublicConfig() {
    return {
      region: this.config.get<string>('OSS_REGION'),
      bucket: this.config.get<string>('OSS_BUCKET'),
      companyId: this.config.get<string>('OSS_COMPANY_ID') || 'default',
    };
  }
}
