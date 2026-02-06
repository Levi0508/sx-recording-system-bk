// src/comments/comment.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';
import { Exclude } from 'class-transformer';

@Entity('vip')
export class VipEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number; //购买人

  @Exclude() //@Exclude() 是 class-transformer 提供的一个装饰器，主要用于在对象序列化（如转换成 JSON）时隐藏某些字段。
  @Column({
    name: 'goods_id',
    type: 'varchar',
    length: 20,
  })
  goodsId!: string; //商品id

  @Column({
    name: 'price',
    type: 'int',
  })
  price!: number; //商品价格

  @Column({
    name: 'name',
    type: 'varchar',
    length: 20,
  })
  name!: string;

  @Column({
    name: 'goods_type',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  goodsType!: string; //vip , avatar_frame

  @Column({
    name: 'has_update_package',
    type: 'boolean',
    default: false,
    nullable: true,
  })
  hasUpdatePackage?: boolean; //是否包后续更新（仅用于anchor类型）

  @Column({
    name: 'purchase_date',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  purchaseDate?: Date; //购买日期（用于计算一个月期限，仅用于anchor类型）
}
