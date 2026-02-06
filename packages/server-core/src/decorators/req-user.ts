import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ServiceException } from 'src/common/ServiceException';
import { winstonService } from 'src/utils/winston-logger';

/**
 * 从请求上下文获取通行证，可以传入一个布尔值，如果为真，那么如果没有通行证，会抛出异常
 */
export const ReqUser = createParamDecorator(
  (data: boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.__user;

    winstonService.info('ReqPassport->user', {
      data,
      user,
    });

    if (data && !user) {
      throw new ServiceException('未登录', -101);
    }

    return user;
  },
);
