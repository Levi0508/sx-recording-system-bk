import { Injectable } from '@nestjs/common';
import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory as ITypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { TypeOrmLogger } from 'src/utils/typeorm-logger';

@Injectable()
export class TypeOrmOptionsFactory implements ITypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entityPrefix: process.env.MYSQL_TABLE_PREFIX, //表名前缀
      autoLoadEntities: true, //自动加载实体
      synchronize: true, //是否在应用程序启动时自动创建数据库表结构
      logging: true, //日志
      poolSize: 10, //指定在连接池中保持的连接数
      connectorPackage: 'mysql2',
      logger: new TypeOrmLogger(),
    };

    return options;
  }
}
