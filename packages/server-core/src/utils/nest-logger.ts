import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as dayjs from 'dayjs';
import { ConsoleLogger, LogLevel, LoggerService } from '@nestjs/common';
import { resolve } from 'node:path';

export class NestLogger implements LoggerService {
  private consoleLogger = new ConsoleLogger('undefined', {
    timestamp: true,
  });

  private unformatConsoleLogger = new (class extends ConsoleLogger {
    winstonLogger = winston.createLogger({
      format: winston.format.combine(
        winston.format.printf(({ message }) => {
          return message;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          filename: resolve(process.cwd(), `logs/nest/%DATE%.log`),
          datePattern: 'YYYY-MM-DD-HH',
          maxFiles: '7d',
          maxSize: '100m',
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: `logs/nest/exceptions.log`,
        }),
      ],
      exitOnError: false,
    });

    public constructor() {
      super('undefined', {
        timestamp: false,
      });
    }

    public override getTimestamp(): string {
      return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    }

    public override formatContext(context: string): string {
      return context ? `[${context}] ` : '';
    }

    public override updateAndGetTimestampDiff(): string {
      return '';
    }

    public override formatTimestampDiff(timestampDiff: number) {
      return ` +${timestampDiff}ms`;
    }

    public override colorize(message: string) {
      return message;
    }

    public override printMessages(
      messages: unknown[],
      context = '',
      logLevel: LogLevel = 'log',
    ) {
      messages.forEach((message) => {
        const pidMessage = this.formatPid(process.pid);
        const contextMessage = this.formatContext(context);
        const timestampDiff = this.updateAndGetTimestampDiff();
        const formattedLogLevel = logLevel.toUpperCase().padStart(7, ' ');
        const formattedMessage = this.formatMessage(
          logLevel,
          message,
          pidMessage,
          formattedLogLevel,
          contextMessage,
          timestampDiff,
        );
        this.winstonLogger.log('info', formattedMessage);
      });
    }
  })();

  public log(message: any, ...optionalParams: any[]) {
    this.unformatConsoleLogger.log(message, ...optionalParams);
    this.consoleLogger.log(message, ...optionalParams);
  }
  public error(message: any, ...optionalParams: any[]) {
    this.unformatConsoleLogger.error(message, ...optionalParams);
    this.consoleLogger.error(message, ...optionalParams);
  }
  public warn(message: any, ...optionalParams: any[]) {
    this.unformatConsoleLogger.warn(message, ...optionalParams);
    this.consoleLogger.warn(message, ...optionalParams);
  }
  public debug(message: any, ...optionalParams: any[]) {
    this.unformatConsoleLogger.debug(message, ...optionalParams);
    this.consoleLogger.debug(message, ...optionalParams);
  }
  public verbose(message: any, ...optionalParams: any[]) {
    this.unformatConsoleLogger.verbose(message, ...optionalParams);
    this.consoleLogger.verbose(message, ...optionalParams);
  }
  public fatal(message: any, ...optionalParams: any[]) {
    this.unformatConsoleLogger.fatal(message, ...optionalParams);
    this.consoleLogger.fatal(message, ...optionalParams);
  }
  public setLogLevels(levels: LogLevel[]) {
    this.unformatConsoleLogger.setLogLevels(levels);
    this.consoleLogger.setLogLevels(levels);
  }
}
