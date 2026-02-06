import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 结束录音会话 DTO（仅会话 ID）
 * 用于 POST /recording/complete：讲解结束后通知后端标记会话完成，不传分片列表时使用
 */
export class CompleteSessionDTO {
  @IsString()
  @IsNotEmpty()
  sessionId?: string;
}
