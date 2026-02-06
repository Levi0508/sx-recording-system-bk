import { BaseEntity } from 'src/base/BaseEntity';
import { VIDEO_TYPE_ENUM } from 'src/enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'video_classification',
})
export class ClassificationEntity extends BaseEntity {
  @Column({
    name: 'classification',
    type: 'varchar',
  })
  classification!: VIDEO_TYPE_ENUM; // 新增的列，用于区分视频类型
}
