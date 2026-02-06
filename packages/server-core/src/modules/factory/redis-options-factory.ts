import { Injectable } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory as IRedisOptionsFactory,
} from '@kazura/nestjs-redis';

@Injectable()
export class RedisOptionsFactory implements IRedisOptionsFactory {
  createRedisModuleOptions(): RedisModuleOptions {
    const options: RedisModuleOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      db: parseInt(process.env.REDIS_DB || '0', 10),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_KEY_PREFIX,
      autoResubscribe: true,
      commandTimeout: parseInt(
        process.env.REIDS_CONNECT_TIMEOUT || '30000',
        10,
      ),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    };

    return options;
  }
}
