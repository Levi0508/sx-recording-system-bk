import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Protocol } from 'src/dtos/protocol-dto';
import { isProtocol } from 'src/utils';
import { winstonService } from 'src/utils/winston-logger';

export const ProtocolBody = createParamDecorator(
  (data: keyof Protocol, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    winstonService.info('ProtocolBody->', {
      data,
      body: request.body,
      isProtocol: isProtocol(request.body),
    });

    const contentType = request.headers['content-type'] || '';

    if (contentType.includes('json') && isProtocol(request.body)) {
      try {
        if (data) {
          return request.body[data] as Protocol[typeof data];
        }
        return request.body as Protocol;
      } catch (error) {
        winstonService.error('ProtocolBody->Error', error);
      }
    }
    throw new HttpException('Invalid Protocol', -400);
  },
);
