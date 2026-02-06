import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceException } from 'src/common/ServiceException';
import { sendMail } from 'src/utils/email';
import { MailEntity } from './entities/email.entity';
import { Repository } from 'typeorm';
import { WinstonService } from '@kazura/nestjs-winston';

@Injectable()
export class MailService {
  @InjectRepository(MailEntity)
  private emailRepository!: Repository<MailEntity>;
  @Inject()
  private logger!: WinstonService;

  private async sendMail(to: string, subject: string, text: string) {
    try {
      sendMail(to, subject, text);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('MailService->sendMail', error.message);
      }

      throw new ServiceException('邮件发送失败');
    }
  }

  async sendCode(email: string, code: string) {
    // TODO 存到数据库
    this.emailRepository.insert({
      email,
      code,
    });

    this.sendMail(
      email,
      `AF-Share 验证码: ${code}`,
      `您正在进行操作验证，验证码：${code}。此邮件由系统自动发送，请勿回复。若您未请求此验证码，请忽略本邮件。`,
    );
  }

  //校验验证码
  async verifyCode(email: string, code: string): Promise<boolean> {
    const result = await this.emailRepository.findOneBy({ email, code });

    if (result) {
      this.emailRepository.softDelete({ id: result.id });
    }
    // TODO 从数据库中查询
    return result !== null;
  }
}
