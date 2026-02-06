import { BaseEntity } from 'src/base/BaseEntity';
import { AVATAR_TYPE_ENUM } from 'src/enum';
import { Entity, Column } from 'typeorm';
import * as dayjs from 'dayjs';

@Entity({
  name: 'avatar_frame',
})
export class AvatarFrameEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId!: number; //头像框拥有人

  @Column({
    name: 'avatar_frame',
    type: 'varchar',
    nullable: true,
    length: 15,
  })
  avatarFrame!: AVATAR_TYPE_ENUM; //头像框枚举

  @Column({
    name: 'price',
    type: 'int',
  })
  price!: number; //头像框价格

  @Column({
    name: 'expiry_date',
    type: 'timestamp',
    nullable: true,
  })
  expiryDate!: Date; //头像框有效期

  //是否在有效期内
  isValid() {
    if (!this.expiryDate) {
      return false;
    }

    const deadLine = dayjs(this.expiryDate);
    const now = dayjs();

    return deadLine.isAfter(now);
  }
}
