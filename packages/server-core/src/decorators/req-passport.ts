import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Exception, Exceptions } from 'src/filters/exceptions';
import { winstonService } from 'src/utils/winston-logger';

/**
 * 从请求上下文获取通行证，可以传入一个布尔值，如果为真，那么如果没有通行证，会抛出异常
 */
export const ReqPassport = createParamDecorator(
  (data: boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const passport = request.__passport;

    winstonService.info('ReqPassport->passport', {
      data,
      passport,
    });

    if (data && !passport) {
      throw new Exception(Exceptions.PassportExpiredError);
    }

    return passport;
  },
);
