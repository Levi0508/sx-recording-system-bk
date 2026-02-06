import { BaseEntity } from 'src/base/BaseEntity';
import { Entity, Column } from 'typeorm';

@Entity({
  name: 'video_history',
})
export class HistoryEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number;

  @Column({
    name: 'video_id',
    type: 'int',
  })
  videoId!: number;
}
