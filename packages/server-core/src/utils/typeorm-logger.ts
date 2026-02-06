import {
  FileLogger,
  AdvancedConsoleLogger,
  LogMessage,
  LogLevel,
  QueryRunner,
} from 'typeorm';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { resolve } from 'node:path';
import * as dayjs from 'dayjs';

export class TypeOrmLogger extends FileLogger {
  private winstonLogger = winston.createLogger({
    format: winston.format.combine(
      winston.format.printf(({ message }) => {
        return message;
      }),
    ),
    transports: [
      new winston.transports.DailyRotateFile({
        filename: resolve(process.cwd(), `logs/typeorm/%DATE%.log`),
        datePattern: 'YYYY-MM-DD-HH',
        maxFiles: '7d',
        maxSize: '100m',
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename: `logs/typeorm/exceptions.log`,
      }),
    ],
    exitOnError: false,
  });

  public constructor() {
    super(true);
  }

  private readonly __logger = new (class extends AdvancedConsoleLogger {
    public __writeLog(
      level: LogLevel,
      logMessage: LogMessage | LogMessage[],
      queryRunner?: QueryRunner,
    ) {
      this.writeLog(level, logMessage, queryRunner);
    }
  })();

  protected override writeLog(
    level: LogLevel,
    logMessage: LogMessage | LogMessage[],
    queryRunner?: QueryRunner,
  ) {
    super.writeLog(level, logMessage, queryRunner);
    this.__logger.__writeLog(level, logMessage, queryRunner);
  }

  protected override write(strings: string | string[]) {
    strings = Array.isArray(strings) ? strings : [strings];

    strings = (strings as string[]).map(
      (str) => '[' + dayjs().format('YYYY-MM-DD HH:mm:ss.SSS') + ']' + str,
    );
    this.winstonLogger.log('info', strings.join('\r\n') + '\r\n');
  }
}
