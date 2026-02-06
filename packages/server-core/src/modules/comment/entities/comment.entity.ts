// src/comments/comment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity('comment')
export class CommentEntity extends BaseEntity {
  @Column({
    name: 'content',
    type: 'varchar',
    length: 255,
  })
  content!: string;

  @Column({
    name: 'video_id',
    type: 'int',
  })
  videoId!: number;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number;

  @Column({
    name: 'like_num',
    type: 'int',
    default: 0,
  })
  likeNum!: number;

  @Column({
    name: 'is_top',
    type: 'boolean',
    default: false,
  })
  isTop!: boolean;

  // @Column({
  //   name: 'is_reply',
  //   type: 'int',
  //   default: 0,
  // })
  // isReply!: number;
}
