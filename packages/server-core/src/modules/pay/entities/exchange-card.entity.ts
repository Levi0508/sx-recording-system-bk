import { BaseEntity } from 'src/base/BaseEntity';
import { Entity, Column } from 'typeorm';

@Entity({
  name: 'exchange_card',
})
export class ExchangeCardEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId?: number; //使用人

  @Column({
    name: 'card_type',
    type: 'int',
  })
  cardType!: number; //卡类型 10/30/50/68/80/200/500

  @Column({
    name: 'card_number',
    type: 'varchar',
    length: 12,
  })
  cardNumber!: string; //卡号

  @Column({
    name: 'card_password',
    type: 'varchar',
    length: 10,
  })
  cardPassword!: string; //卡密

  @Column({
    name: 'exchange_at',
    nullable: true,
  })
  exchangeAt?: Date;
}
