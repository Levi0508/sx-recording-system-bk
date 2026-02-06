import { IsNumber, IsString } from 'class-validator';

/**
 * 补传分片确认 DTO
 * 用于 POST /recording/session/:sessionId/confirm-chunk：补传成功后客户端回调，服务端 headObject 校验通过后落库（方案 A）
 */
export class ConfirmChunkDto {
  @IsNumber()
  chunkId!: number;

  @IsString()
  objectKey!: string;

  @IsNumber()
  size!: number;

  @IsNumber()
  duration!: number;
}
