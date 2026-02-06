import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteSessionDTO {
  @IsString()
  @IsNotEmpty()
  sessionId?: string;
}
