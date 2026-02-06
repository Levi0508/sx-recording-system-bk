import { createLogger } from 'winston';
import * as winston from 'winston';
import { resolve } from 'path';
import { utilities } from 'src/utils/winston.utilities';
import 'winston-daily-rotate-file';
import { WinstonService } from '@kazura/nestjs-winston';

const isDevMode = false;

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(
    utilities.format.nestLike({
      colors: true,
      prettyPrint: true,
    }),
  ),
});

const logTransports = [
  new winston.transports.DailyRotateFile({
    filename: resolve(process.cwd(), `logs/default/%DATE%.log`),
    datePattern: 'YYYY-MM-DD-HH',
    maxFiles: '7d',
    maxSize: '100m',
    format: winston.format.combine(
      utilities.format.nestLike({
        colors: false,
        prettyPrint: true,
      }),
    ),
  }),
  consoleTransport,
];

export const logger = createLogger({
  transports: isDevMode ? consoleTransport : logTransports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: `logs/default/exceptions.log`,
    }),
  ],
  exitOnError: false,
});

export const winstonService = new WinstonService(logger);
