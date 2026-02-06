import { BaseEntity } from 'src/base/BaseEntity';
import { Entity, Column } from 'typeorm';

@Entity({
  name: 'video_favorite',
})
export class FavoriteEntity extends BaseEntity {
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
