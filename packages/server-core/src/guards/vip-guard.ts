import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Exception, Exceptions } from 'src/filters/exceptions';
import { WinstonService } from '@kazura/nestjs-winston';
import { ServiceException } from 'src/common/ServiceException';

@Injectable()
export class VipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private logger: WinstonService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const user = request.__user;
    //反射拿到权限标识
    const isVIP =
      this.reflector.get<boolean>('IsVIP', context.getHandler()) || false;

    this.logger.info('VipGuard->canActivate->actions', isVIP);

    if (!isVIP) return true;

    if (!user) throw new Exception(Exceptions.NoLogin);

    if (!user.isVIP()) throw new ServiceException('需要VIP', -666);

    return true;
  }
}
