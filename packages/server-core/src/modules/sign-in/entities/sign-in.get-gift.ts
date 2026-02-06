import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity({
  name: 'sign-in-get-gift',
})
export class SignInGetGiftEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number; //领取人

  @Column({
    name: 'sign_in_date',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  signInGetDate?: string; //领取日期

  @Column({
    name: 'sign_in_month',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  signInGetMonth?: string; //签到月份

  // @Exclude() //@Exclude() 是 class-transformer 提供的一个装饰器，主要用于在对象序列化（如转换成 JSON）时隐藏某些字段。
  @Column({
    name: 'goods_id',
    type: 'varchar',
    length: 20,
  })
  goodsId!: string; //商品id
}
