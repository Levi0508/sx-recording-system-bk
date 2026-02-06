import { BaseEntity } from 'src/base/BaseEntity';
import { Entity, Column } from 'typeorm';

@Entity({
  name: 'invitation',
})
export class InvitationEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number; //用户id:被邀请人

  @Column({
    name: 'user_nick_name',
    type: 'varchar',
    nullable: true,
    length: 64,
  })
  userNickname!: string;

  @Column({
    name: 'invitation_id',
    type: 'int',
  })
  invitationId!: number; //邀请人id

  @Column({
    name: 'reward',
    type: 'int',
    default: 0,
  })
  reward!: number; // 返利金额
}
