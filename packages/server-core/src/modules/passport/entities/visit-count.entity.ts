import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity({
  name: 'visit_count',
})
export class VisitCountEntity extends BaseEntity {
  @Column({
    name: 'record_date',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  recordDate?: string;

  @Column({ name: 'count', type: 'int', default: 0 })
  count!: number;

  @Column({ name: 'register_count', type: 'int', default: 0 })
  registerCount!: number;

  @Column({ name: 'sign_in_hanle', type: 'int', default: 0 })
  signInHandle!: number;

  // @Column({
  //   name: 'play_times_total',
  //   type: 'int',
  //   default: 0,
  // })
  // playTimesTotal!: number;
}
