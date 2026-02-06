import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  NestFactory,
} from '@nestjs/core';

import { resolve } from 'node:path';
import * as cookieParser from 'cookie-parser';

import { GlobalMiddleware } from '../middlewares/global-middleware';
import { GlobalGuard } from '../guards/global-guard';
import { VipGuard } from '../guards/vip-guard';
import { GlobalExceptionFilter } from '../filters/global-exception-filter';
import { GlobalInterceptor } from '../interceptors/global-interceptor';

import { UserModule } from './user/user.module';
import { PassportModule } from './passport/passport.module';
import { PermissionModule } from './permission/permission.module';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptionsFactory } from './factory/typeorm-options-factory';
import { RedisModule } from '@kazura/nestjs-redis';
import { RedisOptionsFactory } from './factory/redis-options-factory';
import { WinstonModule } from '@kazura/nestjs-winston';
import { WinstonOptionsFactory } from './factory/winston-options-factory';
import { NestLogger } from 'src/utils/nest-logger';
import { MailModule } from './email/email.module';
import { EncryptionService } from 'src/interceptors/encryption.service';
import { EncryptResponseInterceptor } from 'src/interceptors/encrypt-response-Interceptor';
import { RecordingModule } from './recording/recording.module';
import { ReceptionModule } from './reception/reception.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [resolve(process.cwd(), `env/.env.local`)],
      isGlobal: true,
      expandVariables: true,
    }),
    RedisModule.forRootAsync({
      useClass: RedisOptionsFactory,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptionsFactory,
    }),
    //日志
    WinstonModule.forRootAsync({
      useClass: WinstonOptionsFactory,
    }),
    UserModule,
    PassportModule, //通行证
    PermissionModule,
    MailModule,
    RecordingModule,
    ReceptionModule,
  ],
  providers: [
    {
      provide: APP_GUARD, //守卫
      useClass: GlobalGuard,
    },
    {
      provide: APP_GUARD, //守卫
      useClass: VipGuard,
    },
    {
      provide: APP_INTERCEPTOR, //拦截器
      useClass: GlobalInterceptor,
    },
    {
      provide: APP_FILTER, //异常过滤器
      useClass: GlobalExceptionFilter,
    },
    {
      provide: EncryptionService,
      useClass: EncryptionService,
    },
    {
      provide: APP_INTERCEPTOR, //响应加密拦截器
      useClass: EncryptResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalMiddleware).forRoutes('*');
  }

  static async bootstrap() {
    const logger = new NestLogger();

    logger.log('Starting...', 'AppModule->bootstrap');
    logger.log(
      'process.cwd()  ----->  ' + process.cwd(),
      'AppModule->bootstrap',
    );
    logger.log(
      'process.env.NODE_ENV  ----->  ' + process.env.NODE_ENV,
      'AppModule->bootstrap',
    );
    logger.log(
      'process.env.SERVER_PORT  ----->  ' + process.env.SERVER_PORT,
      'AppModule->bootstrap',
    );
    logger.log(
      'process.env.HTTPS_PROXY  ----->  ' + process.env.HTTPS_PROXY,
      'AppModule->bootstrap',
    );

    const app = await NestFactory.create<NestExpressApplication>(this, {
      cors: true,
      logger,
    });

    // app.set('trust proxy', 1);

    app.disable('x-powered-by'); //禁用 'X-Powered-By' 头。这个字段通常包含有关服务器或框架的信息，禁用它可以提高安全性，防止潜在的攻击者获取有关应用程序技术栈的额外信息。

    app.use(cookieParser()); //解析请求中的 cookies

    app.useGlobalPipes(
      new ValidationPipe({
        // whitelist: true,//在验证过程中，DTO类中没有定义的属性会被自动剔除。这有助于防止意外或恶意的数据进入应用程序。
        transform: true, //启用自动转换
        validateCustomDecorators: true, //启用自定义装饰器的验证
      }),
    );

    // 根路径用于浏览器访问验证：打开 http://IP:4000 可见服务是否运行
    const expressApp = app.getHttpAdapter().getInstance?.();
    if (expressApp && typeof expressApp.get === 'function') {
      expressApp.get('/', (_req, res) =>
        res.json({ status: 'ok', message: 'API 服务运行中' }),
      );
    }

    await app.listen(parseInt(process.env.SERVER_PORT || '4000', 10));
  }
}
