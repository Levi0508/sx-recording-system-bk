import { Controller, Inject, Post, Req } from '@nestjs/common';
import { SignInService } from './sign-in.service';

import { Request } from 'express';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { WinstonService } from '@kazura/nestjs-winston';
import { BaseController } from 'src/base/BaseController';

import { ReqUser } from 'src/decorators/req-user';
import { UserEntity } from '../user/entities/user.entity';
import { BuyVipDTO } from '../user/dtos/buy-vip.dto';
import { SignInHandleEntity } from './entities/sign-in-handle.entity';

@Controller('/sign-in')
export class SignInController extends BaseController {
  @Inject()
  private readonly SignInService!: SignInService;

  @Inject()
  private readonly logger!: WinstonService;

  /**
   * 签到
   * @param resource
   * @param user
   * @returns
   */
  // @Post('checkin')
  // async checkin(
  //   @ReqUser(true)
  //   user: UserEntity,
  //   @Req() req: Request,
  // ) {
  //   const xForwardedFor = req.headers['x-forwarded-for'];
  //   const clientIp = Array.isArray(xForwardedFor)
  //     ? xForwardedFor[0]
  //     : xForwardedFor;
  //   let finalIp =
  //     typeof clientIp === 'string' ? clientIp : req.socket.remoteAddress;

  //   // 如果需要处理 IPv4 映射的 IPv6 地址（如 ::ffff:192.168.0.1），可以移除前缀
  //   if (finalIp && finalIp.includes('::ffff:')) {
  //     finalIp = finalIp.split('::ffff:')[1];
  //   }

  //   const data = await this.SignInService.checkin(user.id, finalIp!);
  //   return this.success(data);
  // }
  /**
   * 查询签到
   * @param user
   * @returns
   */
  @Post('checkinInfo')
  async checkinInfo(
    @ReqUser(true)
    user: UserEntity,
  ) {
    const data = await this.SignInService.checkinInfo(user.id);

    return this.success(data);
  }

  /**
   * 领取天数
   * @param user
   * @returns
   */
  // @Post('getGift')
  // async getGift(
  //   @ProtocolResource() resource: BuyVipDTO,
  //   @ReqUser(true)
  //   user: UserEntity,
  // ) {
  //   const { goodsId } = resource;
  //   const data = await this.SignInService.getGift(user, goodsId);

  //   return this.success(data);
  // }

  // @Post('/handle')
  // async create(
  //   @ProtocolResource() resource: { userId?: number; referrer: string },
  //   @Req() req: Request,
  // ) {
  //   const now = new Date();

  //   const xForwardedFor = req.headers['x-forwarded-for'];
  //   const clientIp = Array.isArray(xForwardedFor)
  //     ? xForwardedFor[0]
  //     : xForwardedFor;
  //   let finalIp =
  //     typeof clientIp === 'string' ? clientIp : req.socket.remoteAddress;

  //   // 如果需要处理 IPv4 映射的 IPv6 地址（如 ::ffff:192.168.0.1），可以移除前缀
  //   if (finalIp && finalIp.includes('::ffff:')) {
  //     finalIp = finalIp.split('::ffff:')[1];
  //   }

  //   const entity = new SignInHandleEntity();
  //   // 获取当前时间
  //   entity.userId = resource.userId;
  //   entity.userAgent = req.headers['user-agent']; //设备
  //   entity.ipAddress = finalIp;

  //   entity.signInDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  //   entity.signInTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

  //   entity.referrer = resource.referrer;

  //   // 保存数据到数据库
  //   await this.SignInService.handle(entity);
  //   return this.success();
  // }
  /**
   * 访问echarts
   * @param resource
   * @returns
   */
  @Post('/echarts/list')
  // @EncryptResponse()
  async getEchartsList(
    @ProtocolResource()
    resource: {
      month: string;
    },
  ) {
    const { month } = resource;
    const list = await this.SignInService.getMonthlyAdvertisement(month);

    return this.success(list);
  }
}
