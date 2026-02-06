import { IsNotEmpty } from 'class-validator';

export class TopCommentDto {
  @IsNotEmpty()
  commentId!: number;
}
