import { Injectable } from '@nestjs/common';
import {
  WinstonModuleOptions,
  WinstonOptionsFactory as IWinstonOptionsFactory,
} from '@kazura/nestjs-winston';
import 'winston-daily-rotate-file';

import { logger } from 'src/utils/winston-logger';

@Injectable()
export class WinstonOptionsFactory implements IWinstonOptionsFactory {
  createWinstonModuleOptions(): WinstonModuleOptions {
    return { instance: logger };
  }
}
