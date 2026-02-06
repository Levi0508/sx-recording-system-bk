import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * 创建录音会话 DTO
 * 用于 POST /recording/session：Pad 端开始一次面对面讲解时创建会话，记录 sessionId、患者/客户名、开始时间
 */
export class CreateSessionDTO {
  @IsString()
  @IsNotEmpty()
  sessionId?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsNumber()
  @IsNotEmpty()
  startTime?: number;
}
