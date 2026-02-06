import { Controller, Post, Inject } from '@nestjs/common';

import { ProtocolResource } from 'src/decorators/protocol-resource';

import { BaseController } from 'src/base/BaseController';
import { UserService } from '../user/user.service';
import { ReqUser } from 'src/decorators/req-user';
import { UserEntity } from '../user/entities/user.entity';
import { PayService } from './pay.service';
import { ServiceException } from 'src/common/ServiceException';
import { ExchangeCardDto } from './dto/exchange-card.dto';
import { ExchangeTypeDto } from './dto/exchange-type.dto';
import { ExchangeCardPasswardDto } from './dto/exchange-card-passward.dto';
import { FindInvitationRecordDto } from './dto/find-invitation-record.dto';
import { EncryptResponse } from 'src/interceptors/encrypt-response-Interceptor';
import { ExchangeListDTO } from './dto/exchange-list.dto';
import { WinstonService } from '@kazura/nestjs-winston';
import { NotificationService } from '../notification/notification.service';
import { StatementAction } from 'src/decorators/statement-action';

@Controller('/pay')
export class PayController extends BaseController {
  @Inject()
  private payService!: PayService;
  @Inject()
  private readonly notificationService!: NotificationService;
  @Inject()
  private userService!: UserService;
  @Inject()
  private PayService!: PayService;
  @Inject()
  private readonly logger!: WinstonService;

  @Post('/update/invitationCode')
  async updateInvitationCode(
    @ReqUser(true)
    user: UserEntity,
  ) {
    const invitationPath = await this.userService.updateInvitationCode(user);

    return this.success(invitationPath);
  }

  @Post('/find/invitationCode')
  @EncryptResponse()
  async findInvitationCode(
    @ReqUser(true)
    user: UserEntity,
  ) {
    const userInfo = await this.userService.findOneById(user);

    if (!userInfo) {
      throw new ServiceException('用户不存在');
    }

    return this.success({
      invitationCode: userInfo?.defaultInvitationCode,
    });
  }

  @Post('/exchange_card/create')
  @StatementAction('pay:create:exchange_card')
  async generateRedeemCodes(@ProtocolResource() resource: ExchangeCardDto) {
    const { count, cardType } = resource;

    await this.PayService.generateAndSaveRedeemCodes(count, cardType);
    return this.success();
  }
  /**
   * 根据type查询没使用过的card
   * @param resource
   * @param user
   * @returns
   */
  @Post('/exchange_card/no_use_by_type')
  @StatementAction('pay:read:findNoUseByType')
  @EncryptResponse()
  async findNoUseByType(@ProtocolResource() resource: ExchangeTypeDto) {
    const { cardType } = resource;

    function extractCardDetails(cards: any[]) {
      return cards
        .map((card) => `${card.cardNumber} ${card.cardPassword}`)
        .join(',');
    }

    const result = await this.PayService.findNoUseByType(cardType);
    let data;
    if (result) {
      data = extractCardDetails(result);
    }
    return this.success({
      data,
      length: result.length,
    });
  }

  /**
   * 兑换卡密
   * @param resource
   * @param user
   * @returns
   */

  @Post('/exchange/card')
  async exchangeCard(
    @ProtocolResource() resource: ExchangeCardPasswardDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { cardPassword } = resource;

    const result = await this.PayService.exchangeCard(user, cardPassword);

    // this.notificationService.createSystemNotification(
    // 1,
    //   '关于《播放卡顿》的系统通知',
    //   '当前国内大部分地区线路正常，小部分地区存在异常情况。假如您播放时候明显卡顿，可以挂香港🇭🇰节点的🪜，速度很快 2️⃣ 假如您没有🪜，请联系客服 3️⃣ 有任何需要请联系客服Q：1946742459、3768637494',
    //   user.email,
    // );
    return this.success(result);
  }

  /**
   * 邀请返利中心
   * @param resource
   * @param user
   * @returns
   */
  @Post('/find/invitation/record')
  @EncryptResponse()
  async findInvitationRecord(
    @ProtocolResource() resource: FindInvitationRecordDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { currentPage, pageSize } = resource;
    const result = await this.PayService.findInvitationRecord(
      user,
      currentPage,
      pageSize,
    );
    return this.success(result);
  }

  /**
   * manage 收入模块
   * @param resource
   * @returns
   */
  @Post('/list')
  async getExchangeCards(
    @ProtocolResource()
    resource: ExchangeListDTO,
  ) {
    const { currentPage, pageSize, month, cardType, cardNumber, cardPassword } =
      resource;
    const { list, totalCount } = await this.payService.getExchangeCards(
      currentPage,
      pageSize,
      {
        month,
        cardType,
        cardNumber,
        cardPassword,
      },
    );

    return this.success({
      list,
      totalCount,
    });
  }

  /**
   * 收入echarts
   * @param resource
   * @returns
   */
  @Post('/echarts/list')
  @EncryptResponse()
  async getEchartsList(
    @ProtocolResource()
    resource: {
      month: string;
    },
  ) {
    const { month } = resource;
    const list = await this.payService.getMonthlyRevenue(month);

    return this.success(list);
  }
}
