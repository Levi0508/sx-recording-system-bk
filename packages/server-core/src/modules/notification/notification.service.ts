import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from './entities/notification.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WinstonService } from '@kazura/nestjs-winston';
import { ServiceException } from 'src/common/ServiceException';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { VIDEO_TYPE_ENUM } from 'src/enum';

@Injectable()
export class NotificationService {
  @InjectRepository(NotificationEntity)
  private notificationRepository!: Repository<NotificationEntity>;

  @Inject()
  private readonly configService!: ConfigService;
  @Inject()
  private userService!: UserService;

  @Inject()
  private logger!: WinstonService;

  /**
   * 创建通知
   * @param userId
   * @param sendByUserId
   * @param title
   * @param message
   * @param videoId
   * @returns
   */
  async createNotification(
    userId: number, //收件人
    sendByUserId: number, //发件人
    title: string,
    message: string,
    type = 'user',

    videoId?: number,
    classification?: VIDEO_TYPE_ENUM,
  ) {
    const notification = this.notificationRepository.create({
      userId,
      sendByUserId,
      title,
      message,
      videoId,
      classification,
      type,
    });

    return this.notificationRepository.save(notification);
  }
  async createSystemNotification(
    sendByUserId: number, // 发件人
    title: string,
    message: string,
    email?: string,
    type = 'system', // 默认类型为系统通知
  ) {
    let users = [];

    if (email) {
      // 如果提供了email，则只发送给该邮箱对应的用户
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new ServiceException(`邮箱 ${email} 对应的用户不存在`);
      }
      users = [user];
    } else {
      // 否则发送给所有用户
      users = await this.userService.findAll();
    }

    this.logger.info('发送通知的users', users);

    // 为每个用户创建通知
    const notifications = users.map((user) => {
      return this.notificationRepository.create({
        userId: user.id,
        sendByUserId,
        title,
        message,
        type,
      });
    });

    await this.notificationRepository.save(notifications);

    // const users = await this.userService.findAll();
    // this.logger.info('锋酱的users', users);

    // // 为每个用户创建通知
    // const notifications = users.map((user) => {
    //   return this.notificationRepository.create({
    //     userId: user.id,
    //     sendByUserId,
    //     title,
    //     message,
    //     type,
    //   });
    // });

    // await this.notificationRepository.save(notifications);
  }

  /**
   * 接收通知
   * @param userId
   * @returns
   */
  private async getNotificationsForUser(
    userId: number,
    isRead: boolean,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 10,
  ) {
    const result = await this.notificationRepository.query(
      `
SELECT
  n.*,
  n.id AS notification_id,
  clf_user.*,
  n.created_at AS notification_created_at -- 为 n 表的 created_at 指定一个别名
FROM
  clf_notification n
LEFT JOIN
  clf_user
ON
  n.send_by_user_id = clf_user.id
WHERE
  n.user_id = ?
AND
  n.is_read = ?
ORDER BY
  n.created_at DESC
LIMIT ${(currentPage - 1) * pageSize}, ${pageSize}
      `,
      [userId, isRead],
    );

    // 查询总记录数

    const count = await this.notificationRepository.query(
      `
                SELECT
                  COUNT(n.id) as count
                FROM
                  clf_notification n
                WHERE
                  n.user_id = ?
                AND
                  n.is_read = ?
                `,
      [userId, isRead],
    );
    this.logger.info('锋酱的result', result);
    this.logger.info('锋酱的count', count);
    const list = result.map((record: any) => ({
      id: record.notification_id,
      createdAt: record.notification_created_at,
      updatedAt: record.updated_at,
      deletedAt: record.deleted_at,
      title: record.title,
      videoId: record.video_id,
      message: record.message,
      isRead: record.is_read,
      type: record.type,
      classification: record.classification,
      sendByUser: {
        id: record.send_by_user_id,
        nickname: record.nick_name,
        avatar: record.avatar
          ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${record.send_by_user_id}`
          : null,
      },
    }));
    return {
      list,
      totalCount: count[0].count,
    };
  }

  /**
   * 根据type查询通知
   * @param userId
   * @returns
   */
  private async getNotificationsForUserSystem(
    userId: number,
    type: string,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 10,
  ) {
    const result = await this.notificationRepository.query(
      `
SELECT
  n.*,
  n.id AS notification_id,
  clf_user.*,
  n.created_at AS notification_created_at -- 为 n 表的 created_at 指定一个别名
FROM
  clf_notification n
LEFT JOIN
  clf_user
ON
  n.send_by_user_id = clf_user.id
WHERE
  n.user_id = ?
AND
  n.type = ?
ORDER BY
  n.created_at DESC
LIMIT ${(currentPage - 1) * pageSize}, ${pageSize}
      `,
      [userId, type],
    );

    // 查询总记录数
    const count = await this.notificationRepository.query(
      `
             SELECT
                COUNT(n.id) as count
              FROM
                clf_notification n
              WHERE
                n.user_id = ?
              AND
                n.type = ?
              `,
      [userId, type],
    );
    this.logger.info('锋酱的result', result);

    const list = result.map((record: any) => ({
      id: record.notification_id,
      createdAt: record.notification_created_at,
      updatedAt: record.updated_at,
      deletedAt: record.deleted_at,
      title: record.title,
      videoId: record.video_id,
      message: record.message,
      isRead: record.is_read,
      type: record.type,
      classification: record.classification,
      sendByUser: {
        id: record.send_by_user_id,
        nickname: record.nick_name,
        avatar: record.avatar
          ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${record.send_by_user_id}`
          : null,
      },
    }));
    return {
      list,
      totalCount: count[0].count,
    };
  }
  // private async getNotificationsForUserSystem(
  //   userId: number,
  //   type: string,
  //   currentPage: number = 1, // 默认页码为1
  //   pageSize: number = 10,
  // ) {
  //   let query = `
  //     SELECT
  //       n.*,
  //       n.id AS notification_id,
  //       clf_user.*
  //     FROM
  //       clf_notification n
  //     LEFT JOIN
  //       clf_user
  //     ON
  //       n.send_by_user_id = clf_user.id
  //     WHERE
  //       n.type = ?
  //   `;

  //   const queryParams: any[] = [type];

  //   // 如果不是系统通知，则根据userId过滤
  //   if (type !== 'system') {
  //     query += ' AND n.user_id = ?';
  //     queryParams.push(userId);
  //   }

  //   query += `
  //     ORDER BY
  //       n.created_at DESC
  //     LIMIT ?, ?
  //   `;

  //   queryParams.push((currentPage - 1) * pageSize, pageSize);

  //   const result = await this.notificationRepository.query(query, queryParams);

  //   // 查询总记录数
  //   let countQuery = `
  //     SELECT
  //       COUNT(n.id) as count
  //     FROM
  //       clf_notification n
  //     WHERE
  //       n.type = ?
  //   `;

  //   if (type !== 'system') {
  //     countQuery += ' AND n.user_id = ?';
  //   }

  //   const countParams = [type];
  //   if (type !== 'system') {
  //     countParams.push(userId as any);
  //   }

  //   const count = await this.notificationRepository.query(
  //     countQuery,
  //     countParams,
  //   );

  //   const list = result.map((record: any) => ({
  //     id: record.notification_id,
  //     createdAt: record.created_at,
  //     updatedAt: record.updated_at,
  //     deletedAt: record.deleted_at,
  //     title: record.title,
  //     videoId: record.video_id,
  //     message: record.message,
  //     isRead: record.is_read,
  //     type: record.type,
  //     classification: record.classification,
  //     sendByUser: {
  //       id: record.send_by_user_id,
  //       nickname: record.nick_name,
  //       avatar: record.avatar
  //         ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${record.send_by_user_id}`
  //         : null,
  //     },
  //   }));

  //   return {
  //     list,
  //     totalCount: count[0].count,
  //   };
  // }

  /**
   * 接收未读通知
   * @param userId
   * @returns
   */
  async getNotificationsUnRead(
    userId: number,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 10,
  ) {
    const list = await this.getNotificationsForUser(
      userId,
      false,
      currentPage,
      pageSize,
    );
    return list;
  }
  /**
   * 接收已读通知
   * @param userId
   * @returns
   */
  async getNotificationsRead(
    userId: number,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 10,
  ) {
    const list = await this.getNotificationsForUser(
      userId,
      true,
      currentPage,
      pageSize,
    );
    return list;
  }

  /**
   * 根据类型查询消息 /video/system/user
   * @param userId
   * @returns
   */
  async getNotificationsSystem(
    userId: number,
    type: string,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 10,
  ) {
    const list = await this.getNotificationsForUserSystem(
      userId,
      type,
      currentPage,
      pageSize,
    );
    return list;
  }

  /**
   * 阅读通知
   * @param userId
   * @param notificationId
   */
  async markAsRead(userId: number, notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });
    this.logger.info('锋酱的notification111', notification);

    if (notification) {
      if (notification.isRead) {
        throw new ServiceException('该回复已经已读');
      } else {
        await this.notificationRepository.update(
          { id: notificationId },
          {
            isRead: true,
          },
        );
      }
    } else {
      throw new ServiceException('不存在');
    }
  }

  /**
   * 一键已读
   * @param userId
   * @returns
   */
  async markNotificationsAsRead(userId: number) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }
}
