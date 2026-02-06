import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
