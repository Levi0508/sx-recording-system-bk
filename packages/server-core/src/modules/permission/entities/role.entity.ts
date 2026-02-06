import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'role',
})
export class RoleEntity extends BaseEntity {
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
}
