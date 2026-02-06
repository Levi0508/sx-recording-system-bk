import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 获取 OSS 预签名上传地址 DTO
 * 用于 POST /recording/oss/presign-upload：前端直传 OSS 前，按 sessionId + chunkId 换取该分片的 PUT URL
 */
export class PresignUploadDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @Type(() => Number)
  @IsNumber()
  chunkId!: number;
}
