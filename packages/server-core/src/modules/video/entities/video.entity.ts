import { BaseEntity } from 'src/base/BaseEntity';
import { VIDEO_TYPE_ENUM } from 'src/enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'video_upload',
})
export class VideoEntity extends BaseEntity {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 100,
  })
  title!: string;
  // @Column()
  // description!: string;

  @Column({
    name: 'file_name',
    type: 'varchar',
    length: 100,
  })
  filename!: string;

  @Column({
    name: 'path',
    type: 'varchar',
  })
  path!: string;

  @Column({
    name: 'classification',
    type: 'varchar',
  })
  classification!: VIDEO_TYPE_ENUM; // 新增的列，用于区分视频类型

  @Column({
    name: 'thumbnail_path',
    type: 'varchar',
    nullable: true,
  })
  thumbnailPath?: string; // 缩略图路径，可为空

  @Column({
    name: 'compressedThumbnail_path',
    type: 'varchar',
    nullable: true,
  })
  compressedThumbnailPath?: string; // 压缩缩略图路径，可为空

  @Column({
    name: 'video_path',
    type: 'varchar',
    nullable: true,
  })
  videoPath?: string; // 视频地址，可为空

  @Column({
    name: 'play_times',
    type: 'int',
    default: 0,
  })
  playTimes!: number;

  @Column({
    name: 'likes',
    type: 'int',
    default: 0,
  })
  likes!: number; // 点赞数

  @Column({
    name: 'favorites',
    type: 'int',
    default: 0,
  })
  favorites!: number; // 收藏数

  @Column({
    name: 'duration',
    type: 'int',
    default: 0,
  })
  duration!: number; //时长s

  @Column({
    name: 'size',
    type: 'int',
    default: 0,
  })
  size!: number; // 文件大小bytes

  @Column({
    name: 'status',
    type: 'int',
    default: 0,
  })
  status!: number; // 本地m3u8的文件是否上传完毕
}
