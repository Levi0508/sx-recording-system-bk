import { Controller, Post, Inject } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { MailService } from './email.service';

import { generateCode } from 'src/utils';
import { BaseController } from 'src/base/BaseController';
import { UserService } from '../user/user.service';
import { RedisService } from '@kazura/nestjs-redis';
import { ServiceException } from 'src/common/ServiceException';
import { ProtocolResource } from 'src/decorators/protocol-resource';

@Controller('/email')
export class MailController extends BaseController {
  @Inject()
  private mailService!: MailService;
  @Inject()
  private userService!: UserService;
  @Inject()
  private redisService!: RedisService;

  @Post('/sendCode/register')
  async sendCodeWidthRegister(@ProtocolResource() resource: CreateEmailDto) {
    const email = resource.email;
    if (!email) {
      return this.error('请提供邮箱');
    }

    const user = await this.userService.findOneByEmail(email);

    if (user) {
      return this.error('用户已注册');
    }

    const redisClient = this.redisService.getClient();
    // 尝试获取锁
    const lockKey = `cardPassword:${email}:sendEmail:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    if (acquiredLock === 1) {
      await redisClient.expire(lockKey, 120); //上锁5s
    } else {
      throw new ServiceException('发送邮件太频繁，请2分钟后重试');
    }

    this.sendCode(resource);
    return this.success();
  }

  @Post('/sendCode/resetPassword')
  async sendCodeWithResetPassword(
    @ProtocolResource() resource: CreateEmailDto,
  ) {
    const email = resource.email;
    if (!email) {
      return this.error('请提供邮箱');
    }

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return this.error('用户尚未注册');
    }
    const redisClient = this.redisService.getClient();
    // 尝试获取锁
    const lockKey = `cardPassword:${email}:resetPassword:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    if (acquiredLock === 1) {
      await redisClient.expire(lockKey, 120); //上锁5s
    } else {
      throw new ServiceException('发送邮件太频繁，请2分钟后重试');
    }

    this.sendCode(resource);
    return this.success();
  }

  private sendCode(resource: CreateEmailDto) {
    const code = generateCode();

    const email = resource.email;
    return this.mailService.sendCode(email, code);
  }
}
