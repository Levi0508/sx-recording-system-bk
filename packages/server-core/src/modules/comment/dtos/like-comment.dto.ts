import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeCommentDto {
  @IsNotEmpty()
  commentId!: number;

  @IsNotEmpty()
  @IsNumber()
  videoId!: number;

  @IsNotEmpty()
  @IsNumber()
  isReply!: number; //0一级 1二级
}
