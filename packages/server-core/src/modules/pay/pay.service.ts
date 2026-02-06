import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceException } from 'src/common/ServiceException';
import { Between, DataSource, Like, Repository } from 'typeorm';
import { WinstonService } from '@kazura/nestjs-winston';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { InvitationEntity } from './entities/invitation.entity';
import { generateRedeemCodes } from 'src/utils';
import { ExchangeCardEntity } from './entities/exchange-card.entity';
import { RedisService } from '@kazura/nestjs-redis';
import * as dayjs from 'dayjs';
import { AvatarFrameEntity } from '../user/entities/avatar-frame.entity';

@Injectable()
export class PayService {
  @InjectRepository(InvitationEntity)
  private invitationRepository!: Repository<InvitationEntity>;
  @InjectRepository(ExchangeCardEntity)
  private exchangeCardRepository!: Repository<ExchangeCardEntity>;
  @InjectRepository(UserEntity)
  private userRepository!: Repository<UserEntity>;
  @InjectRepository(AvatarFrameEntity)
  private avatarFrameRepository!: Repository<AvatarFrameEntity>;
  @Inject()
  private readonly userService!: UserService;
  @Inject()
  private redisService!: RedisService;
  @Inject()
  private readonly dataSource!: DataSource;
  @Inject()
  private logger!: WinstonService;

  /**
   * 邀请返利查询
   * @param user
   * @param currentPage
   * @param pageSize
   * @returns
   */
  async findInvitationRecord(
    user: UserEntity,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 20,
  ) {
    const userInvitations = await this.invitationRepository
      .createQueryBuilder('invitation')
      // .leftJoinAndSelect(UserEntity, 'user', 'user.id = invitation.userId')
      .where('invitation.invitationId = :userId', { userId: user.id })
      .orderBy('invitation.createdAt', 'DESC')
      .skip((currentPage - 1) * pageSize) // 跳过的记录条数
      .take(pageSize) // 返回的记录条数
      .getMany();

    const totalCount = await this.invitationRepository.count({
      where: { invitationId: user.id },
    });

    const effectiveUsers = await this.invitationRepository
      .createQueryBuilder('invitation')
      .select('COUNT(DISTINCT invitation.userId)', 'count')
      .where('invitation.invitationId = :userId', { userId: user.id })
      .getRawOne();

    const effectiveUserCount = effectiveUsers
      ? parseInt(effectiveUsers.count, 10)
      : 0;

    const totalRewardResult = await this.invitationRepository
      .createQueryBuilder('invitation')
      .select('SUM(invitation.reward)', 'sum')
      .where('invitation.invitationId = :userId', { userId: user.id })
      .getRawOne();

    const totalReward = totalRewardResult
      ? parseInt(totalRewardResult.sum, 10)
      : 0;

    this.logger.info('锋酱的dd', {
      list: userInvitations,
      totalCount,
    });

    return {
      list: userInvitations,
      totalCount,
      effectiveUserCount,
      totalReward,
    };
  }

  /**
   * 生成卡号+卡密
   * @param count
   * @param type
   */
  async generateAndSaveRedeemCodes(count: number, cardType: number) {
    const cards = generateRedeemCodes(count, cardType);

    const redeemCodeEntities = cards.map((code) => {
      const exchangeCard = new ExchangeCardEntity();
      exchangeCard.cardNumber = code.cardNumber;
      exchangeCard.cardPassword = code.cardPassword;
      exchangeCard.cardType = cardType;

      return exchangeCard;
    });

    await this.exchangeCardRepository.save(redeemCodeEntities);
  }

  /**
   * 查找未使用的卡
   * @param cardType
   * @returns
   */
  async findNoUseByType(cardType: number) {
    return this.exchangeCardRepository
      .createQueryBuilder('exchange_card')
      .where('exchange_card.card_type = :cardType', { cardType })
      .andWhere('exchange_card.user_id IS NULL') // 查找 userId 为 null 的记录
      .getMany();
  }
  /**
   * 查找卡
   * @param cardType
   * @returns
   */
  private async findByCardPassward(cardPassword: string) {
    return this.exchangeCardRepository.findOneBy({
      cardPassword,
    });
  }

  /**
   * 兑换卡密
   * @param user
   * @param cardPassword
   */

  async exchangeCard(user: UserEntity, cardPassword: string) {
    const redisClient = this.redisService.getClient();
    // 尝试获取锁
    const lockKey = `cardPassword:${user.id}:${cardPassword}:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    try {
      if (acquiredLock === 1) {
        await redisClient.expire(lockKey, 5); //上锁5s
      } else {
        throw new ServiceException('上一次兑换尚未完成，请稍后再试');
      }
    } catch (err) {
      throw new ServiceException('上一次兑换尚未完成，请稍后再试');
    }
    const card = await this.findByCardPassward(cardPassword);
    const userInfo = await this.userService.findOneById(user.id);
    // 创建一个新的查询运行器
    const queryRunner = this.dataSource.createQueryRunner();

    // 使用我们的新查询运行器建立真实的数据库连接
    await queryRunner.connect();

    // 现在让我们打开一个新的事务：
    await queryRunner.startTransaction();

    if (!userInfo) {
      throw new ServiceException('用户不存在');
    }
    if (!card) {
      throw new ServiceException('卡密不存在');
    }
    if (card.userId) {
      throw new ServiceException('卡密已失效');
    }

    try {
      if (userInfo.invitationUserId) {
        // 计算返利金额，这里假设返利比例为 10%
        const rebateAmount = card.cardType * 10 * 0.1;

        await this.userRepository.manager.transaction(async (manager) => {
          await manager.increment(
            UserEntity,
            { id: userInfo.invitationUserId },
            'money',
            rebateAmount,
          );
          // 记录返利信息到 InvitationEntity
        });
        await this.invitationRepository.manager.transaction(async (manager) => {
          const invitation = new InvitationEntity();
          invitation.userId = user.id; // 被邀请人的用户ID
          invitation.userNickname = user.nickname || '默认昵称';
          invitation.invitationId = userInfo.invitationUserId!; // 邀请人的用户ID
          invitation.reward = rebateAmount;
          await manager.save(invitation);
        });
      }

      //活动相关 《开始》显示
      const currentDate = dayjs().add(8, 'hour'); // 当前时间，UTC 时间
      const startDate = dayjs('2025-08-29T9:00:00').add(8, 'hour');
      const endDate = dayjs('2026-02-01T23:59:59').add(8, 'hour');

      const isInEventPeriod =
        currentDate.isAfter(startDate) && currentDate.isBefore(endDate);

      await this.userRepository.manager.transaction(async (manager) => {
        const multiplier = isInEventPeriod ? 12 : 10; // 活动期间乘以12，否则乘以10
        await manager.update(
          UserEntity,
          { id: userInfo.id },
          {
            money: userInfo.money + card.cardType * multiplier,
            points: userInfo.points + card.cardType * multiplier,
          },
        );
      });
      //活动相关 《结束》显示
      // await this.userRepository.manager.transaction(async (manager) => {
      //   await manager.update(
      //     UserEntity,
      //     { id: userInfo.id },
      //     {
      //       money: userInfo.money + card.cardType * 10,
      //     },
      //   );
      // });

      await this.exchangeCardRepository.manager.transaction(async (manager) => {
        await manager.update(
          ExchangeCardEntity,
          { id: card.id },
          {
            userId: user.id,
            exchangeAt: new Date(),
          },
        );
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // throw new ServiceException('交换卡失败');
    }
  }

  /**
   * 兑换
   * @param currentPage
   * @param pageSize
   * @param filter
   * @returns
   */
  async getExchangeCards(
    currentPage: number = 1, // 当前页码，默认第一页
    pageSize: number = 10, // 每页显示的数量，默认10
    filter: {
      month?: string; // 按月份搜索，格式: YYYYMM
      cardType?: number; // 卡类型过滤条件
      cardNumber?: string; // 卡号过滤条件
      cardPassword?: string; // 卡号过滤条件
    },
  ) {
    const { month, cardType, cardNumber, cardPassword } = filter;
    this.logger.info('锋酱的month', month);

    // 构造查询条件
    const where: any = {};

    // 按月份搜索 (假设 exchangeAt 是 Date 类型, 按月份查询)
    if (month) {
      const year = Number(month.slice(0, 4)); // 获取年份部分
      const monthPart = Number(month.slice(4, 6)); // 获取月份部分

      if (monthPart < 1 || monthPart > 12) {
        throw new Error('Invalid month format'); // 校验月份格式
      }

      // 设置日期范围，从当前月的第一天到下个月的第一天
      const startDate = new Date(year, monthPart - 1, 1); // 当前月的第一天
      const endDate = new Date(year, monthPart, 0); // 当前月的最后一天

      where.exchangeAt = Between(startDate, endDate); // 使用 Between 进行日期范围查询
    }

    if (cardType) {
      where.cardType = cardType; // 按卡类型过滤
    }

    if (cardNumber) {
      where.cardNumber = Like(`%${cardNumber}%`); // 模糊搜索卡号
    }
    if (cardPassword) {
      where.cardPassword = Like(`%${cardPassword}%`); // 模糊搜索卡号
    }

    // 查询总记录数
    const totalCount = await this.exchangeCardRepository.count({ where });

    // 查询符合条件的收入记录，分页和排序
    const list = await this.exchangeCardRepository.find({
      where,
      select: [
        'userId',
        'cardType',
        'cardNumber',
        'exchangeAt',
        'cardPassword',
      ],
      order: { exchangeAt: 'DESC' }, // 根据兑换时间倒序排序
      skip: (currentPage - 1) * pageSize, // 跳过当前页之前的记录
      take: pageSize, // 取出当前页的记录
    });

    return { list, totalCount };
  }

  /**
   * 收入echarts
   * @param monthYear
   * @returns
   */
  async getMonthlyRevenue(
    monthYear: string,
  ): Promise<{ date: string; revenue: number }[]> {
    // 解析年份和月份
    const year = parseInt(monthYear.substring(0, 4), 10);
    const month = parseInt(monthYear.substring(4, 6), 10);

    // 计算该月的开始和结束日期
    // 计算该月的开始和结束日期
    const start = dayjs(new Date(year, month - 1))
      .startOf('month')
      // .add(-8, 'hour') // 加上8小时
      .toDate();
    const end = dayjs(new Date(year, month))
      .startOf('month')
      .subtract(1, 'day')
      .endOf('day')
      // .add(-8, 'hour') // 加上8小时
      .toDate(); //

    this.logger.info('锋酱的start', {
      start,
      end,
    });

    // 查询该月的所有记录
    const exchangeCards = await this.exchangeCardRepository
      .createQueryBuilder('exchange_card')
      .select('DATE(exchange_card.exchange_at)', 'date')
      .addSelect('SUM(exchange_card.card_type)', 'revenue') // 确保 card_type 是收入字段
      .where(
        'exchange_card.exchange_at >= :start AND exchange_card.exchange_at <= :end',
        {
          start,
          end,
        },
      )
      .groupBy('DATE(exchange_card.exchange_at)')
      .orderBy('DATE(exchange_card.exchange_at)', 'ASC')
      .getRawMany();
    this.logger.info('锋酱的exchangeCards', exchangeCards);

    // 将查询结果格式化
    const dailyRevenue = [];
    let currentDate = dayjs(start);

    while (currentDate.isBefore(dayjs(end).add(1, 'day'))) {
      const formattedDate = currentDate.format('MM-DD');
      const record = exchangeCards.find(
        (item: any) => dayjs(item.date).format('MM-DD') === formattedDate,
      );
      dailyRevenue.push({
        date: formattedDate,
        revenue: record ? parseFloat(record.revenue) : 0,
      });
      currentDate = currentDate.add(1, 'day');
    }
    const data = dailyRevenue.splice(-1);
    return dailyRevenue;
  }
}
