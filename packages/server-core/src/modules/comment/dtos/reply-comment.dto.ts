import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReplyCommentDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  commentId!: number; //被回复的评论id

  // @IsNotEmpty()
  // @IsNumber()
  // videoId!: number;

  @IsNotEmpty()
  @IsNumber()
  isReply!: number;

  // @IsNotEmpty()
  // @IsNumber()
  // replyUserId!: number; //被回复人

  // @IsOptional()
  // @IsNumber()
  // replyCommentId!: number; //回复的父级id
}
