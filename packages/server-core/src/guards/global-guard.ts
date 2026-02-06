import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Exception, Exceptions } from 'src/filters/exceptions';
import { RoleEntity } from 'src/modules/permission/entities/role.entity';
import { PermissionService } from 'src/modules/permission/permission.service';
import { WinstonService } from '@kazura/nestjs-winston';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
    private logger: WinstonService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    this.logger.info('GlobalGuard->canActivate->cookies', request.cookies);
    response.cookie('test', 'test');

    //反射拿到权限标识
    const actions =
      this.reflector.get<string[]>('StatementAction', context.getHandler()) ||
      [];

    this.logger.info('GlobalGuard->canActivate->actions', {
      actions,
      roles: request.__roles,
    });

    // 如果没有声明权限，则默认通过
    if (!actions.length) return true;
    this.logger.info('GlobalGuard->canActivate->auth', request.__user);
    // 进行鉴权，如果没有权限
    if (!this.auth(actions, request.__roles)) {
      // 且没有登录，则抛出未登录异常
      if (!request.__user) throw new Exception(Exceptions.NoLogin);
      // 已经登录，则抛出权限不足异常
      throw new Exception(Exceptions.PermissionDeniedError);
    }

    return true;
  }

  auth(actions: string[], roles: RoleEntity[]) {
    const roleIds = roles.map((role) => role.id);

    // 目前规则：必须可以匹配全部action，才能通过鉴权
    const tag = actions.every((action) =>
      this.permissionService.can(roleIds, action),
    );

    this.logger.info('GlobalGuard->auth->tag', tag);

    return tag;
  }
}
