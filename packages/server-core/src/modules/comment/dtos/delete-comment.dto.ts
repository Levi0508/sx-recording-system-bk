import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DeleteCommentDto {
  @IsNotEmpty()
  @IsNumber()
  commentId!: number;

  @IsNotEmpty()
  @IsNumber()
  isReply!: number; //0一级 1二级
}
