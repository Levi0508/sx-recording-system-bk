import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';
import { SetMetadata } from '@nestjs/common';

@Injectable()
export class EncryptResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly encryptionService: EncryptionService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const encrypt = this.reflector.get<boolean>(
      'encrypt',
      context.getHandler(),
    );
    if (!encrypt) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const encryptedData = this.encryptionService.encrypt(
          JSON.stringify(data.resource),
        );
        return { ...data, resource: encryptedData };
      }),
    );
  }
}

export const EncryptResponse = () => SetMetadata('encrypt', true);
