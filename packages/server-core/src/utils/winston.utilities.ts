import { Format } from 'logform';

export type NestLikeConsoleFormatOptions = {
  colors?: boolean;
  prettyPrint?: boolean;
};

import * as winston from 'winston';
import { inspect } from 'node:util';
import safeStringify from 'fast-safe-stringify';
import * as dayjs from 'dayjs';
import { clc } from '.';

const nestLikeColorScheme: Record<string, (text: string) => string> = {
  error: clc.red,
  warn: clc.yellow,
  info: clc.cyanBright,
  debug: clc.magentaBright,
};

const nestLikeConsoleFormat = (
  options: NestLikeConsoleFormatOptions = {
    prettyPrint: false,
  },
): Format =>
  winston.format.printf(({ level, message, data }) => {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

    const stringifiedMeta = safeStringify(data);
    const formattedMeta = options.prettyPrint
      ? inspect(JSON.parse(stringifiedMeta), {
          colors: options.colors,
          depth: null,
        })
      : stringifiedMeta;

    let str = `[${timestamp}] ${level.toUpperCase()}:  ${message}`;

    if (options.colors) {
      str = nestLikeColorScheme[level](str);
    }

    return (
      str +
      (formattedMeta && formattedMeta !== '{}'
        ? `\r\n${formattedMeta}\r\n`
        : '\r\n')
    );
  });

export const utilities = {
  format: {
    nestLike: nestLikeConsoleFormat,
  },
};
