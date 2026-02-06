import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * OSS 直传模式下，单个分片的上传结果项
 * 用于 complete 时提交：分片序号、OSS Object Key、文件大小、时长，供后端落库并完成会话
 */
export class OssChunkItemDto {
  @IsNumber()
  chunkId!: number;

  @IsString()
  objectKey!: string;

  @IsNumber()
  size!: number;

  @IsNumber()
  duration!: number;
}

/**
 * 结束录音会话 DTO（支持 OSS 分片列表）
 * 用于 POST /recording/complete：当使用 OSS 直传时，传 chunks 数组，后端按 OSS 分片落库并标记会话完成；不传 chunks 时与普通 complete 一致
 */
export class CompleteSessionOssDto {
  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OssChunkItemDto)
  chunks?: OssChunkItemDto[];
}
