import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity({
  name: 'sign-in-stats',
})
export class SignInStatsEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number; //签到人

  @Column({
    name: 'current_sign_in_month',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  currentSignInMonth?: string; //当前签到月

  @Column({ name: 'total_checkins', type: 'int', default: 0 })
  totalCheckins!: number; // 当前月累计签到天数

  @Column({ name: 'current_streak', type: 'int', default: 0 })
  currentStreak!: number; // 当前月连续签到天数

  // @Column({ name: 'longest_streak', type: 'int', default: 0 })
  // longest_streak!: number; // 最高连续签到天数
}
