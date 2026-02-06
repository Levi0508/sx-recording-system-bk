// src/comments/comment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';
import { VIDEO_TYPE_ENUM } from 'src/enum';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId?: number;

  @Column({
    name: 'send_by_user_id',
    type: 'int',
  })
  sendByUserId!: number;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
  })
  title!: string;

  @Column({
    name: 'video_id',
    type: 'int',
    nullable: true,
  })
  videoId?: number;

  @Column({
    name: 'classification',
    type: 'varchar',
    nullable: true,
  })
  classification?: VIDEO_TYPE_ENUM; // 新增的列，用于区分视频类型

  @Column({
    name: 'message',
    type: 'varchar',
    length: 255,
  })
  message!: string;

  @Column({
    name: 'is_read',
    type: 'boolean',
    default: false,
  })
  isRead!: boolean;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 255,
  })
  type!: string; //邮件类型 video/system/user
}
