import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity({
  name: 'sign-in-handle',
})
export class SignInHandleEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId?: number; //点击人 登陆状态才记录，可为空

  @Column({
    name: 'sign_in_date',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  signInDate?: string; //点击日期

  @Column({
    name: 'sign_in_time',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  signInTime?: string; //点击时间

  @Column({
    name: 'ip_address',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  ipAddress?: string; //ip

  @Column({
    name: 'user_agent',
    type: 'varchar',
    nullable: true,
  })
  userAgent?: string; //用户代理/设备

  @Column({
    name: 'referrer',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  referrer?: string; // 记录用户来源页面
}
