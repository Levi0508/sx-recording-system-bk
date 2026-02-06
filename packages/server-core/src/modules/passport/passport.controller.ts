import { Controller, Inject, Post, Req } from '@nestjs/common';
import { PassportService } from './passport.service';
import { PassportEntity } from './entities/passport.entity';
import { Request } from 'express';
import { ReqPassport } from 'src/decorators/req-passport';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { PermissionService } from '../permission/permission.service';
import { WinstonService } from '@kazura/nestjs-winston';
import { BaseController } from 'src/base/BaseController';
import { EncryptResponse } from 'src/interceptors/encrypt-response-Interceptor';
import { UserService } from '../user/user.service';

@Controller('/passport')
export class PassportController extends BaseController {
  @Inject()
  private readonly passportService!: PassportService;
  @Inject()
  private readonly permissionService!: PermissionService;
  @Inject()
  private readonly userService!: UserService;

  @Inject()
  private readonly logger!: WinstonService;

  @Post('/create')
  @EncryptResponse()
  async create(
    @ReqPassport() passport: PassportEntity | null,
    @ProtocolResource() resource: { clientIdentifier?: string },
    @Req() req: Request,
  ) {
    // 更新访问次数
    this.logger.info('PassportController->create->passport', passport);
    this.logger.info('PassportController->create->req->ip', req.ip);

    const xForwardedFor = req.headers['x-forwarded-for'];
    const clientIp = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : xForwardedFor;
    let finalIp =
      typeof clientIp === 'string' ? clientIp : req.socket.remoteAddress;

    // 如果需要处理 IPv4 映射的 IPv6 地址（如 ::ffff:192.168.0.1），可以移除前缀
    if (finalIp && finalIp.includes('::ffff:')) {
      finalIp = finalIp.split('::ffff:')[1];
    }
    if (req.__user?.id) {
      await this.userService.updateUserAgentAndIP(
        req.__user?.id,
        finalIp,
        req.headers['user-agent'],
      );
    }

    const entity = new PassportEntity();
    entity.userAgent = req.headers['user-agent']; //设备
    entity.ipAddress = finalIp;

    entity.clientIdentifier = resource.clientIdentifier || 'unknown';

    // 如果meta里面存在通行证，说明 旧的通行证没有过期，需要延长有效期。否则创建新的通行证(初进入页面就需要通行证)
    if (passport) {
      const oldPassport = await this.passportService.extendValidity(
        passport,
        entity,
      );

      // 如果用户已登录，获取已购买的月合集商品和主播合集商品
      let purchasedMonthGoods = {};
      let purchasedAnchorGoods = {};
      let purchasedAnchorUpdatePackages = {};
      if (req.__user?.id) {
        purchasedMonthGoods = await this.userService.getPurchasedMonthGoods(
          req.__user.id,
        );
        purchasedAnchorGoods = await this.userService.getPurchasedAnchorGoods(
          req.__user.id,
        );
        // 批量获取已购主播的更新包状态（供热门主播/所有主播列表页使用）
        purchasedAnchorUpdatePackages =
          await this.userService.getBatchAnchorUpdatePackageStatus(
            req.__user.id,
          );
      }

      return this.success({
        passport: oldPassport,
        user: req.__user,
        statements: this.permissionService.getStatementsByRoleEntities(
          req.__roles, //[ { effect: 'Allow', action: [ '*' ] } ]
        ),
        purchasedMonthGoods,
        purchasedAnchorGoods,
        purchasedAnchorUpdatePackages,
      });
    } else {
      const newPassport = await this.passportService.create(entity);

      return this.success({
        passport: newPassport,
        user: null,
        statements: [],
      });
    }
  }

  @Post('/update/visit_count')
  async updateVisitCount() {
    // 更新访问次数
    await this.passportService.updateVisitCount();
    return this.success();
  }
}
