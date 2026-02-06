// src/comments/reply.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity('reply')
export class ReplyEntity extends BaseEntity {
  @Column({
    name: 'content',
    type: 'varchar',
    length: 255,
  })
  content!: string;

  @Column({
    name: 'comment_id',
    type: 'int',
  })
  commentId!: number;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number;

  @Column({
    name: 'reply_user_id',
    type: 'int',
  })
  replyUserId!: number; //被回复人

  @Column({
    name: 'reply_is_reply',
    type: 'int',
    default: 0,
  })
  replyIsReply!: number; //回复0一级评论/1二级评论

  @Column({
    name: 'reply_is_reply_user_id',
    type: 'int',
    nullable: true,
  })
  replyIsReplyUserId?: number; //回复0一级评论/1二级评论 的人

  @Column({
    name: 'video_id',
    type: 'int',
  })
  videoId!: number;

  @Column({
    name: 'like_num',
    type: 'int',
    default: 0,
  })
  likeNum!: number;
}
