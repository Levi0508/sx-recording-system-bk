import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'policy',
})
export class PolicyEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name!: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  description?: string;

  @Column({
    name: 'document',
    type: 'text',
  })
  document!: string;
}
