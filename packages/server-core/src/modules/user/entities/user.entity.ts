import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity } from 'typeorm';
import * as dayjs from 'dayjs';
import { isMobilePhone } from 'src/utils/isMobile';
import { AVATAR_TYPE_ENUM, VIP_TYPE_ENUM } from 'src/enum';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @Column({
    name: 'user_name',
    type: 'varchar',
    nullable: true,
    length: 64,
  })
  username?: string;

  @Column({
    name: 'nick_name',
    type: 'varchar',
    nullable: true,
    length: 64,
  })
  nickname?: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: true,
    length: 32,
  })
  password?: string;

  @Column({
    name: 'salt',
    type: 'varchar',
    nullable: true,
    length: 32,
  })
  salt?: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    nullable: true,
    length: 16,
  })
  phone?: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: true,
    length: 64,
  })
  email?: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  avatar?: string;

  @Column({
    name: 'avatar_frame',
    type: 'varchar',
    nullable: true,
    length: 15,
  })
  avatarFrame?: AVATAR_TYPE_ENUM;

  @Column({
    name: 'experience',
    type: 'int',
    nullable: true,
    default: () => 0,
  })
  experience!: number;

  @Column({
    name: 'points',
    type: 'int',
    default: 0,
  })
  points!: number; //积分

  @Column({
    name: 'money',
    type: 'int',
    default: 0,
  })
  money!: number;

  @Column({
    name: 'invitation_user_id',
    type: 'int',
    nullable: true,
  })
  invitationUserId?: number; //邀请注册的人

  @Column({
    name: 'default_invitation_code',
    type: 'varchar',
    nullable: true,
    length: 6,
  })
  defaultInvitationCode?: string; //自己的邀请码（注册时即生成）

  @Column({
    name: 'ip_address',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  ipAddress?: string;

  //用户代理/设备
  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent?: string;

  @Column({
    name: 'vip_dead_line',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  vipDeadLine?: Date;

  @Column({
    name: 'vip_type',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  vipType?: VIP_TYPE_ENUM;

  @Column({
    name: 'ban_account_date',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  banAccountDate?: Date;

  isVIP() {
    if (!this.vipDeadLine) {
      return false;
    }

    const deadLine = dayjs(this.vipDeadLine);
    const now = dayjs();

    return deadLine.isAfter(now);
  }

  isBan() {
    if (!this.banAccountDate) {
      return false;
    }

    const banAccountDate = dayjs(this.banAccountDate);
    const now = dayjs();

    return banAccountDate.isAfter(now);
  }

  isMobile() {
    if (!this.userAgent) {
      return false;
    }
    return isMobilePhone(this.userAgent);
  }
}
