import { Controller, Inject, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

import { ProtocolResource } from 'src/decorators/protocol-resource';
import { WinstonService } from '@kazura/nestjs-winston';
import { BaseController } from 'src/base/BaseController';
import { ReqUser } from 'src/decorators/req-user';
import { UserEntity } from '../user/entities/user.entity';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { ReadNotificationDto } from './dtos/read-notification.dto';
import { FindNotificationDto } from './dtos/find-notification.dto';
import { TypeNotificationDto } from './dtos/type-notification.dto';
import { ServiceException } from 'src/common/ServiceException';
import { EncryptResponse } from 'src/interceptors/encrypt-response-Interceptor';
import { CreateSystemNotificationDto } from './dtos/create-system-notification.dto';
import { StatementAction } from 'src/decorators/statement-action';

@Controller('/notification')
export class NotificationController extends BaseController {
  @Inject()
  private readonly notificationService!: NotificationService;

  @Inject()
  private readonly logger!: WinstonService;

  /**
   * 创建通知
   * @param resource
   * @param user
   * @returns
   */
  @Post('create')
  async createNotification(
    @ProtocolResource() resource: CreateNotificationDto,
    @ReqUser(true)
    user: UserEntity, //发件人
  ) {
    const { message, title, videoId, userId, classification, type } = resource;
    if (user.id === userId) {
      throw new ServiceException('不能给自己发私信');
    }

    await this.notificationService.createNotification(
      userId,
      user.id,
      title,
      message,
      type,
      videoId,
      classification,
    );
    return this.success();
  }

  @Post('createSystemNotification')
  @StatementAction('notification:create:createSystemNotification')
  async createSystemNotification(
    @ProtocolResource() resource: CreateSystemNotificationDto,
    @ReqUser(true) user: UserEntity, // 发件人
  ) {
    const { message, title, email } = resource;

    // 调用系统通知服务
    await this.notificationService.createSystemNotification(
      user.id,
      title,
      message,
      email,
    );

    return this.success();
  }

  /**
   * 接收未读通知
   * @param user
   * @returns
   */
  @Post('receive/unread')
  @EncryptResponse()
  async getNotificationsUnRead(
    @ProtocolResource() resource: FindNotificationDto,
    @ReqUser(true)
    user: UserEntity, //收件人
  ) {
    const { currentPage, pageSize } = resource;
    const result = await this.notificationService.getNotificationsUnRead(
      user.id,
      currentPage,
      pageSize,
    );
    return this.success(result);
  }
  /**
   * 接收已读通知
   * @param user
   * @returns
   */
  @Post('receive/read')
  @EncryptResponse()
  async getNotificationsRead(
    @ProtocolResource() resource: FindNotificationDto,
    @ReqUser(true)
    user: UserEntity, //收件人
  ) {
    const { currentPage, pageSize } = resource;

    const result = await this.notificationService.getNotificationsRead(
      user.id,
      currentPage,
      pageSize,
    );
    return this.success(result);
  }

  /**
   * 根据类型查询消息 /video/system/user
   * @param user
   * @returns
   */
  @Post('receive/type')
  @EncryptResponse()
  async getNotificationsSystem(
    @ProtocolResource() resource: TypeNotificationDto,
    @ReqUser(true)
    user: UserEntity, //收件人
  ) {
    const { type, currentPage, pageSize } = resource;

    const result = await this.notificationService.getNotificationsSystem(
      user.id,
      type,
      currentPage,
      pageSize,
    );
    return this.success(result);
  }

  /**
   * 阅读通知
   * @param resource
   * @param user
   * @returns
   */
  @Post('read')
  async markAsRead(
    @ProtocolResource() resource: ReadNotificationDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    await this.notificationService.markAsRead(user.id, resource.notificationId);
    return this.success();
  }

  @Post('read/all')
  async readAll(
    @ReqUser(true)
    user: UserEntity,
  ) {
    await this.notificationService.markNotificationsAsRead(user.id);
    return this.success();
  }
}
