import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'email_verify',
})
export class MailEntity extends BaseEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
  })
  email!: string;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 6,
  })
  code!: string;
}
