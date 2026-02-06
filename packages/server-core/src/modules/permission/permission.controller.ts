import { Controller, Get, Post } from '@nestjs/common';
import { Result } from 'src/utils/result';
import { PermissionService } from './permission.service';
import { StatementAction } from 'src/decorators/statement-action';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { BaseDTO } from 'src/base/BaseDTO';
import {
  PolicyCreateDTO,
  PolicyUpdateDTO,
  RoleCreateDTO,
  RoleUpdateDTO,
} from './dtos';
import { RoleEntity } from './entities/role.entity';

@Controller('/permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('/refreshPermissionsCache')
  @StatementAction('permission:manage:refreshPermissionsCache')
  async refreshPermissionsCache() {
    this.permissionService.init();
    return new Result({});
  }

  @Post('/role/list')
  @StatementAction('permission:read:roleList')
  async roleList() {
    const roles = await this.permissionService.findAllRoles();
    return new Result(roles);
  }

  @Post('/policy/list')
  @StatementAction('permission:read:policyList')
  async policyList() {
    const policies = await this.permissionService.findAllPolicies();

    return new Result(policies);
  }

  @Post('/role/delete')
  @StatementAction('permission:delete:roleDelete')
  async roleDelete(@ProtocolResource() resource: BaseDTO) {
    await this.permissionService.deleteRoleById(resource.id);
    return new Result({});
  }

  @Post('/role/create')
  @StatementAction('permission:create:roleCreate')
  async roleCreate(@ProtocolResource() resource: RoleCreateDTO) {
    const entity = new RoleEntity();
    entity.name = resource.name;
    entity.description = resource.description;
    await this.permissionService.createRole(entity);
    return new Result({});
  }

  @Post('/role/update')
  @StatementAction('permission:update:roleUpdate')
  async roleUpdate(@ProtocolResource() resource: RoleUpdateDTO) {
    const entity = new RoleEntity();
    entity.id = resource.id;
    entity.name = resource.name;
    entity.description = resource.description;
    await this.permissionService.updateRole(entity);
    return new Result({});
  }

  @Post('/policy/delete')
  @StatementAction('permission:delete:policyDelete') //权限
  async policyDelete(@ProtocolResource() resource: BaseDTO) {
    await this.permissionService.deletePolicyById(resource.id);
    return new Result({});
  }

  @Post('/policy/create')
  @StatementAction('permission:create:policyCreate')
  async policyCreate(@ProtocolResource() resource: PolicyCreateDTO) {
    const entity = new RoleEntity();
    entity.name = resource.name;
    entity.description = resource.description;
    await this.permissionService.createRole(entity);
    return new Result({});
  }

  @Post('/policy/update')
  @StatementAction('permission:update:policyUpdate')
  async policyUpdate(@ProtocolResource() resource: PolicyUpdateDTO) {
    const entity = new RoleEntity();
    entity.id = resource.id;
    entity.name = resource.name;
    entity.description = resource.description;
    await this.permissionService.updateRole(entity);
    return new Result({});
  }
}
