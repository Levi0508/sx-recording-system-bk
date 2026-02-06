import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
    // 从 ConfigService 中获取密钥
    this.secretKey = this.configService.get<string>('ENCRYPT_KEY')!;
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16); // 每次加密时生成新的 IV
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secretKey, 'hex'),
      iv,
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(hash: string): string {
    const [iv, encryptedText] = hash.split(':');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.secretKey, 'hex'),
      Buffer.from(iv, 'hex'),
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
