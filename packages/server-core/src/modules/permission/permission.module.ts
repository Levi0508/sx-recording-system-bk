import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PolicyEntity } from './entities/policy.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { RolePolicyEntity } from './entities/role-policy.entity';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PolicyEntity,
      UserRoleEntity,
      RolePolicyEntity,
    ]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [TypeOrmModule, PermissionService],
})
export class PermissionModule {}
