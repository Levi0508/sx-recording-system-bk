import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'passport',
})
export class PassportEntity extends BaseEntity {
  @Column({
    name: 'token',
    type: 'varchar',
    length: 64,
  })
  token!: string;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId?: number;

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

  //内容标识符
  @Column({
    name: 'client_identifier',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  clientIdentifier?: string;
}
