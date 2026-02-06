import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsNumber()
  videoId!: number;

  // @IsOptional()
  // @IsNumber()
  // replyCommentId?: number;
}
