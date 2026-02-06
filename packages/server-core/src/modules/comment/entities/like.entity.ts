import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity('comment_like')
export class CommentLikeEntity extends BaseEntity {
  @Column({
    name: 'comment_id',
    type: 'int',
  })
  commentId!: number; //点赞的评论id

  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number;
  //点赞的用户id

  @Column({
    name: 'video_id',
    type: 'int',
  })
  videoId!: number; //点赞的视频id

  @Column({
    name: 'is_reply',
    type: 'int',
  })
  isReply!: number; // 记录点赞的是一级还是二级回复
}
