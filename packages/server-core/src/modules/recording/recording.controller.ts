import { Controller, Get, Param, Post } from '@nestjs/common';
import { BaseController } from 'src/base/BaseController';
import { CreateSessionDTO } from './dtos/create-session.dto';
import { CompleteSessionOssDto } from './dtos/complete-session-oss.dto';
import { PresignUploadDto } from './dtos/presign-upload.dto';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { RecordingService } from './recording.service';
import { RecordingOssService } from './recording-oss.service';
import { ReqUser } from 'src/decorators/req-user';
import { UserEntity } from '../user/entities/user.entity';
import { ServiceException } from 'src/common/ServiceException';

@Controller('recording')
export class RecordingController extends BaseController {
  constructor(
    private readonly recordingService: RecordingService,
    private readonly recordingOssService: RecordingOssService,
  ) {
    super();
  }

  /**
   * OSS 直传：获取单个分片的预签名 PUT URL
   * 前端直传 OSS 前调用，按 sessionId + chunkId 换取该分片的 PUT 地址与 headers，需登录、走协议体
   */
  @Post('oss/presign-upload')
  async getPresignUploadUrl(
    @ReqUser(true) user: UserEntity,
    @ProtocolResource() resource: PresignUploadDto,
  ) {
    const userId = user?.id != null ? Number(user.id) : NaN;
    if (!Number.isFinite(userId)) {
      throw new ServiceException('用户信息无效，请重新登录', -101);
    }
    const sessionId =
      typeof resource?.sessionId === 'string' ? resource.sessionId.trim() : '';
    const chunkId =
      typeof resource?.chunkId === 'number'
        ? resource.chunkId
        : Number(resource?.chunkId);
    if (!sessionId || !Number.isFinite(chunkId) || chunkId < 0) {
      throw new ServiceException('sessionId 或 chunkId 无效', 400);
    }
    try {
      const result = this.recordingOssService.getPresignPutUrl(
        userId,
        sessionId,
        chunkId,
      );
      return this.success(result);
    } catch (e: any) {
      console.error('[presign-upload]', e?.message || e);
      throw new ServiceException(
        e?.message || '获取上传地址失败',
        e?.statusCode ?? 500,
      );
    }
  }

  /**
   * 创建录音会话
   * Pad 端开始一次面对面讲解时调用，写入 sessionId、客户名、开始时间，返回创建的会话信息。走协议体时从 resource 解出参数。
   */
  @Post('session')
  async createSession(@ProtocolResource() resource: CreateSessionDTO) {
    const sessionId =
      typeof resource?.sessionId === 'string' ? resource.sessionId.trim() : '';
    const startTime =
      typeof resource?.startTime === 'number'
        ? resource.startTime
        : Number(resource?.startTime);
    if (!sessionId) {
      throw new ServiceException('sessionId 不能为空', 400);
    }
    if (!Number.isFinite(startTime)) {
      throw new ServiceException('startTime 必须为有效数字', 400);
    }
    const dto: CreateSessionDTO = {
      sessionId,
      clientName:
        typeof resource?.clientName === 'string'
          ? resource.clientName.trim()
          : undefined,
      startTime,
    };
    const result = await this.recordingService.createSession(dto);
    return this.success(result);
  }

  /**
   * 结束录音会话
   * 传 chunks 数组，按 OSS 分片落库并标记会话完成；走协议体
   */
  @Post('complete')
  async completeSession(@ProtocolResource() dto: CompleteSessionOssDto) {
    const sessionId = dto.sessionId!;
    if (dto.chunks && dto.chunks.length > 0) {
      const result = await this.recordingService.completeSessionWithOssChunks(
        sessionId,
        dto.chunks.map((c) => ({
          chunkId: c.chunkId,
          objectKey: c.objectKey,
          size: c.size,
          duration: c.duration,
        })),
      );
      return this.success(result);
    }
    const result = await this.recordingService.completeSession(sessionId);
    return this.success(result);
  }

  /**
   * 查询某次会话已上传的分片 ID 列表
   * 用于前端断点续传：根据已存在的 chunkId 决定哪些分片需要重传或跳过
   */
  @Get('session/:sessionId/chunks')
  async getUploadedChunks(@Param('sessionId') sessionId: string) {
    const chunkIds = await this.recordingService.getUploadedChunks(sessionId);
    return this.success(chunkIds);
  }

  /**
   * 已完成的会话列表（Explore 例音用）
   * 返回 status=completed 的会话，按 startTime 倒序，供前端展示例音列表
   */
  @Get('sessions')
  async getSessions() {
    const list = await this.recordingService.getCompletedSessions();
    return this.success(list);
  }

  /**
   * 某会话的例音播放 URL 列表（分片顺序，前端按序播放即合并效果）
   * 从 DB 取该会话下已上传分片的 oss_object_key，逐个生成 OSS 临时读链接
   * 返回 [{ chunkId, url, duration }]，按 chunkId 升序
   */
  @Get('session/:sessionId/play-urls')
  async getSessionPlayUrls(@Param('sessionId') sessionId: string) {
    const chunks = await this.recordingService.getChunksWithOssKey(sessionId);
    const playUrls = chunks
      .filter((c) => c.ossObjectKey)
      .map((c) => ({
        chunkId: c.chunkId,
        url: this.recordingOssService.getSignUrlForPlay(c.ossObjectKey!),
        duration: c.duration ?? 0,
      }));
    return this.success(playUrls);
  }
}
