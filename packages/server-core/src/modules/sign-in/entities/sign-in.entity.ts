import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity({
  name: 'sign-in',
})
export class SignInEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number; //签到人

  @Column({
    name: 'sign_in_date',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  signInDate?: string; //签到日期

  @Column({
    name: 'sign_in_time',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  signInTime?: string; //签到时间

  @Column({
    name: 'ip_address',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  ipAddress?: string; //ip
}
