import { v1, v4 } from 'uuid';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Protocol } from 'src/dtos/protocol-dto';

export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateCode = () => `${random(100000, 999999)}`;

export const generateToken = () => v1().concat(v4()).replaceAll('-', '');

export const generateUUID = () => v4().replaceAll('-', '');

export const md5 = (str: string) =>
  createHash('md5').update(str, 'utf-8').digest('hex');

export const isProtocol = (obj: unknown): obj is Protocol => {
  if (typeof obj !== 'object') return false;
  if (obj === null) return false;
  if (Array.isArray(obj)) return false;
  const pack = obj as Protocol;
  if (typeof pack.passport !== 'string') return false;
  if (typeof pack.session !== 'string') return false;
  if (typeof pack.resource !== 'object') return false;
  if (typeof pack.sign !== 'string') return false;
  if (typeof pack.other !== 'object') return false;
  return true;
};

export const serializeInstance = <T>(object: T) => {
  return JSON.stringify(instanceToPlain(object));
};

export const deserializeInstance = <T>(
  cls: ClassConstructor<T>,
  plain: string,
) => {
  return plainToInstance(cls, JSON.parse(plain));
};

export const clc = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

//不定位数的验证码（用于邀请码）
export const generateRandomCode = (length: number = 6) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

//自动生成卡号卡密
export const generateRedeemCodes = (count: number, type: number) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const cardNumber = generateRandomCode(12); // 假设卡号长度为12
    const cardPassword = generateRandomCode(10); // 假设卡密长度为10
    codes.push({ cardNumber, cardPassword, type });
  }
  return codes;
};

async function checkFileExists(filePath: string) {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
}

export async function determineVideoPath(
  pathsToCheck: string[],
  filename: string,
) {
  for (const dir of pathsToCheck) {
    const filePath = path.join(dir, `${filename}/video.m3u8`);
    console.log(`Checking path: ${filePath}`);

    if (await checkFileExists(filePath)) {
      return filePath;
    }
  }
  return ''; // 或者其他默认值/处理逻辑
}
