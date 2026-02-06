import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { Result } from 'src/utils/result';
import { WinstonService } from '@kazura/nestjs-winston';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(private logger: WinstonService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    this.logger.info('GlobalInterceptor->Request', {
      body: request.body,
      headers: request.headers,
    });

    return next.handle().pipe(
      tap((value) => {
        this.logger.info('GlobalInterceptor->Response', {
          value,
          headers: response.getHeaders(),
        });
      }),
      map((value) => {
        // 如果是 Result 类型的响应 则 调用 update 方法
        if (value instanceof Result) {
          value.update(request);
        }
        return value;
      }),
    );
  }
}
