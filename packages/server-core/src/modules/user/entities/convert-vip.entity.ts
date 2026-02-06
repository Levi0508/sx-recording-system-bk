import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity({
  name: 'convert_vip',
})
@Index(['userId'], { unique: true }) // 确保每个用户只能有一条折算记录
export class ConvertVipEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number; // 用户ID

  @Column({
    name: 'email',
    type: 'varchar',
    length: 64,
  })
  email!: string; // 用户邮箱

  @Column({
    name: 'vip_dead_line',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  vipDeadLine?: Date; // VIP过期时间

  @Column({
    name: 'days',
    type: 'int',
  })
  days!: number; // 折算天数

  @Column({
    name: 'platform_coins',
    type: 'int',
  })
  platformCoins!: number; // 折算的平台币数量

  @Column({
    name: 'money_added',
    type: 'int',
  })
  moneyAdded!: number; // 增加的余额（存储格式，实际值*10）
}
