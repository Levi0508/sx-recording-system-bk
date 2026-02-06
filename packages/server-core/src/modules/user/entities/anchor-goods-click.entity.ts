import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/base/BaseEntity';

@Entity({
  name: 'anchor_goods_click',
})
export class AnchorGoodsClickEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number; // 用户ID

  @Column({
    name: 'goods_id',
    type: 'varchar',
    length: 50,
  })
  goodsId!: string; // 商品ID（主播合集ID）

  @Column({
    name: 'url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  url?: string; // 点击时跳转的URL
}
