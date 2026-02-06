import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { PolicyEntity } from './entities/policy.entity';
import { RoleEntity } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RolePolicyEntity } from './entities/role-policy.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { PolicyDocument } from './utils/policy-document';
import { PolicyStatement } from './utils/policy-statement';
import { WinstonService } from '@kazura/nestjs-winston';

@Injectable()
export class PermissionService {
  private association: Map<
    number,
    {
      roles: RoleEntity[];
      policies: PolicyEntity[];
      document: PolicyDocument[];
    }
  > = new Map();

  constructor(
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(RolePolicyEntity)
    private rolePolicyRepository: Repository<RolePolicyEntity>,
    @InjectRepository(PolicyEntity)
    private policyRepository: Repository<PolicyEntity>,
    private logger: WinstonService,
  ) {
    this.init();
  }

  async init() {
    try {
      //查询所有角色、策略、角色-策略关联关系
      const [roles, policies, association] = await Promise.all([
        this.findAllRoles(),
        this.findAllPolicies(),
        this.findAllRolePolicies(),
      ]);

      this.logger.info('PermissionService->init->roles', roles);
      this.logger.info('PermissionService->init->policies', policies);
      this.logger.info('PermissionService->init->association', association);

      //对每个角色，查找它对应的策略，然后将角色和策略存入 association Map 中。
      roles.forEach((role) => {
        const policyIds = association
          .filter(({ roleId }) => roleId === role.id)
          .map(({ policyId }) => policyId);

        const _policies = policies.filter(({ id }) => policyIds.includes(id));

        this.association.set(role.id, {
          roles: [role],
          policies: _policies,
          document: _policies.map(
            ({ document }) => new PolicyDocument(document),
          ),
        });
      });
    } catch (error) {
      this.logger.error('PermissionService->init', error);
    }
  }

  /**
   * 根据角色id获取关联的策略实体
   * @param roleIds
   * @returns
   */
  getPolicyEntitiesByRoleIds(roleIds: number[]) {
    if (!roleIds.length) return [];
    const policyMap: Map<number, PolicyEntity> = new Map();

    roleIds.forEach((roleId) => {
      const pack = this.association.get(roleId);
      if (!pack) return;
      const { policies } = pack;
      policies.forEach((policy) => {
        policyMap.set(policy.id, policy);
      });
    });

    return Array.from(policyMap.values());
  }

  /**
   * 根据角色id获取关联的documents策略文档
   * @param entities
   * @returns
   */
  getPolicyDocumentsByRoleIds(roleIds: number[]) {
    if (!roleIds.length) return [];
    const documentMap: Map<number, PolicyDocument> = new Map();

    roleIds.forEach((roleId) => {
      const pack = this.association.get(roleId);
      if (!pack) return;

      const { document, policies } = pack;
      policies.forEach((policy, index) => {
        documentMap.set(policy.id, document[index]);
      });
    });

    return Array.from(documentMap.values());
  }

  getDocumentsByRoleEntities(entities: RoleEntity[]) {
    if (!entities.length) return [];
    const roleIds = entities.map(({ id }) => id);
    return this.getPolicyDocumentsByRoleIds(roleIds);
  }

  /**
   * 根据角色id获取关联的statements
   * @param roleIds
   * @returns
   */
  getPolicyStatementsByRoleIds(roleIds: number[]) {
    if (!roleIds.length) return [];
    const statements: PolicyStatement[] = [];
    this.getPolicyDocumentsByRoleIds(roleIds).forEach(({ statement }) =>
      statements.push(...statement),
    );
    return statements;
  }

  getStatementsByRoleEntities(entities: RoleEntity[]) {
    if (!entities.length) return [];
    const roleIds = entities.map(({ id }) => id);
    return this.getPolicyStatementsByRoleIds(roleIds);
  }

  /**
   * 核心的权限控制逻辑。根据给定的角色ID数组和操作（action），检查这些角色是否有权限执行该操作。
   * @param roleIds
   * @param action
   * @returns
   */
  can(roleIds: number[], action: string): boolean {
    this.logger.info('Permission->can', {
      roleIds,
      action,
    });
    const documents = this.getPolicyDocumentsByRoleIds(roleIds);
    this.logger.info('Permission->can->documents', documents);
    return PolicyDocument.merge(documents).can(action);
  }

  findAllRoles() {
    return this.roleRepository.find();
  }

  findAllPolicies() {
    return this.policyRepository.find();
  }

  findAllUserRoles() {
    return this.userRoleRepository.find();
  }

  findAllRolePolicies() {
    return this.rolePolicyRepository.find();
  }

  async getRolesByUserId(user: UserEntity | number) {
    const id = user instanceof UserEntity ? user.id : user;

    const subQuery1 = (qb: SelectQueryBuilder<RoleEntity>) => {
      const roleIds = qb
        .subQuery()
        .select('UserRoleEntity.role_id')
        .from(UserRoleEntity, 'UserRoleEntity')
        .where('UserRoleEntity.user_id = :userId', { userId: id })
        .getQuery();
      return `role.id IN ${roleIds}`;
    };

    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .where(subQuery1)
      .getMany();

    this.logger.info('PermissionService->getRolesByUserId', roles);
    return roles;
  }

  async getPoliciesByUserId(user: UserEntity | number) {
    const id = user instanceof UserEntity ? user.id : user;

    const subQuery1 = (qb: SelectQueryBuilder<RolePolicyEntity>) => {
      const roleIds = qb
        .subQuery()
        .select('UserRoleEntity.role_id')
        .from(UserRoleEntity, 'UserRoleEntity')
        .where('UserRoleEntity.user_id = :userId', { userId: id })
        .getQuery();
      return `RolePolicyEntity.role_id IN ${roleIds}`;
    };

    const subQuery2 = (qb: SelectQueryBuilder<PolicyEntity>) => {
      const policyIds = qb
        .subQuery()
        .select('RolePolicyEntity.policy_id')
        .from(RolePolicyEntity, 'RolePolicyEntity')
        .where(subQuery1)
        .getQuery();
      return `policy.id IN ${policyIds}`;
    };

    const policies = await this.policyRepository
      .createQueryBuilder('policy')
      .where(subQuery2)
      .getMany();

    this.logger.info('PermissionService->getPoliciesByUserId', policies);
    return policies;
  }

  deleteRoleById(role: RoleEntity | number) {
    const id = role instanceof RoleEntity ? role.id : role;
    this.userRoleRepository.softDelete({ roleId: id });
    return this.roleRepository.softDelete({ id });
  }

  deletePolicyById(policy: PolicyEntity | number) {
    const id = policy instanceof PolicyEntity ? policy.id : policy;
    this.rolePolicyRepository.softDelete({ policyId: id });
    return this.policyRepository.softDelete({ id });
  }

  createRole(role: RoleEntity) {
    const { name, description } = role;
    return this.roleRepository.insert({ name, description });
  }

  createPolicy(policy: PolicyEntity) {
    const { name, description, document } = policy;
    return this.policyRepository.insert({ name, description, document });
  }

  updateRole(role: RoleEntity) {
    const { id, name, description } = role;
    return this.roleRepository.update({ id }, { name, description });
  }

  updatePolicy(policy: PolicyEntity) {
    const { id, name, description, document } = policy;
    return this.policyRepository.update(
      { id },
      { name, description, document },
    );
  }
}
