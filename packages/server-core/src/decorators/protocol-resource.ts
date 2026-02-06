import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { isProtocol } from 'src/utils';
import { winstonService } from 'src/utils/winston-logger';

export const ProtocolResource = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    winstonService.info('ProtocolResource->', {
      data,
      body: request.body,
      isProtocol: isProtocol(request.body),
    });

    const contentType = request.headers['content-type'] || '';
    //检查请求体是否符合特定的协议格式（通过Content-Type和isProtocol函数）。
    if (contentType.includes('json') && isProtocol(request.body)) {
      try {
        //从请求体中提取resource属性。
        return request.body['resource'];
      } catch (error) {
        winstonService.error('ProtocolResource->Error', error);
      }
    }
    throw new HttpException('Invalid Protocol', -400);
  },
);
