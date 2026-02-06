import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Result } from 'src/utils/result';
import type { Request, Response } from 'express';
import { WinstonService } from '@kazura/nestjs-winston';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: WinstonService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    this.logger.info('锋酱的exception', exception);

    // 如果是 HttpException 则 处理成 Result 响应
    if (exception instanceof HttpException) {
      const result = Result.exception(exception);
      result.update(request);
      response.status(HttpStatus.OK).json(result);
    } else {
      // 否则 记录错误 并 响应 500
      this.logger.error('GlobalExceptionFilter->Error', exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Unknown Error');
    }
  }
}
