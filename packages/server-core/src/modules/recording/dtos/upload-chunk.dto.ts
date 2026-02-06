import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadChunkDTO {
  @IsString()
  @IsNotEmpty()
  sessionId?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  chunkId?: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  duration?: number;
}
