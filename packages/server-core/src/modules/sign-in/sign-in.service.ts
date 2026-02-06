import { Inject, Injectable } from '@nestjs/common';
import {
  deserializeInstance,
  generateToken,
  serializeInstance,
} from 'src/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@kazura/nestjs-redis';
import { WinstonService } from '@kazura/nestjs-winston';
import { ServiceException } from 'src/common/ServiceException';

import { SignInEntity } from './entities/sign-in.entity';
import { ExchangeCardEntity } from '../pay/entities/exchange-card.entity';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entities/user.entity';
import { SignInStatsEntity } from './entities/sign-in-stats.entity';
import * as dayjs from 'dayjs';
import { UserService } from '../user/user.service';
import { giftMap } from 'src/utils/goods';
import { SignInGetGiftEntity } from './entities/sign-in.get-gift';
import { SignInHandleEntity } from './entities/sign-in-handle.entity';

@Injectable()
export class SignInService {
  @InjectRepository(SignInEntity)
  private readonly signInRepository!: Repository<SignInEntity>;
  @InjectRepository(SignInStatsEntity)
  private readonly signInStatsRepository!: Repository<SignInStatsEntity>;
  @InjectRepository(SignInGetGiftEntity)
  private readonly signInGetGiftRepository!: Repository<SignInGetGiftEntity>;
  @InjectRepository(SignInHandleEntity)
  private readonly signInHandleRepository!: Repository<SignInHandleEntity>;

  @Inject()
  private readonly userService!: UserService;
  @Inject()
  private redisService!: RedisService;

  @Inject()
  private readonly configService!: ConfigService;

  @Inject()
  private logger!: WinstonService;

  findStatsOneByUserId(userId: number, month: string) {
    return this.signInStatsRepository.findOneBy({
      userId,
      currentSignInMonth: month,
    });
  }

  /**
   * 签到
   *    * @param userId
   */
  async checkin(userId: number, finalIp: string) {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const signInTime = now.toTimeString().split(' ')[0]; // HH:mm:ss

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 检查是否已经存在该 IP 在当天的签到记录
    const existingRecord = await this.signInRepository.findOne({
      where: {
        ipAddress: finalIp,
        signInDate: today,
      },
    });
    this.logger.info('锋酱的', existingRecord);

    if (existingRecord) {
      throw new ServiceException('同一个网络不能重复签到');
    }

    // 1️⃣ 检查今天是否已签到
    const todayCheckin = await this.signInRepository.findOne({
      where: { userId, signInDate: today },
    });
    if (todayCheckin) {
      throw new ServiceException('今日已签到');
    }

    const redisClient = this.redisService.getClient();
    // 尝试获取锁
    const lockKey = `sign:${userId}:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'sign_in_locked');

    try {
      if (acquiredLock === 1) {
        await redisClient.expire(lockKey, 3); //上锁3s
        // 2️⃣ 并发防重：插入签到记录时加唯一索引，避免重复签到
        try {
          await this.signInRepository.insert({
            userId,
            signInDate: today,
            signInTime,
            ipAddress: finalIp,
          });
        } catch (error) {
          throw new ServiceException('今日已签到');
        }

        // 3️⃣ 获取用户当前月份的签到统计
        let currentMonth = today.split('-').slice(0, 2).join('-'); // 获取当前月份 'YYYY-MM'

        let userStats = await this.signInStatsRepository.findOne({
          where: { userId, currentSignInMonth: currentMonth },
        });

        // 如果当前月份的签到数据不存在，插入新的记录
        if (!userStats) {
          userStats = this.signInStatsRepository.create({
            userId,
            totalCheckins: 0,
            currentStreak: 0,
            currentSignInMonth: currentMonth, // 当前月
          });
        }

        // 4️⃣ 计算连续签到天数
        const yesterdayCheckin = await this.signInRepository.findOne({
          where: { userId, signInDate: yesterdayStr },
        });
        if (yesterdayCheckin) {
          userStats.currentStreak = userStats.currentStreak + 1;
        } else {
          userStats.currentStreak = 1; // 如果昨天没有签到，则从 1 开始
        }

        // 5️⃣ 更新累计签到天数
        userStats.totalCheckins += 1;

        // 6️⃣ 保存或更新签到统计
        await this.signInStatsRepository.save(userStats);

        return {
          message: '签到成功',
          currentStreak: userStats.currentStreak,
          totalCheckins: userStats.totalCheckins,
          currentSignInMonth: userStats.currentSignInMonth, // 返回当前月
        };
      } else {
        throw new ServiceException('当前签到人数过多，请稍后再试');
      }
    } catch (err) {
      throw new ServiceException('当前签到人数过多，请稍后再试');
    }
  }

  /**
   * 查询用户当月签到情况
   */
  async checkinInfo(userId: number) {
    const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7);
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');
    this.logger.info('锋酱的checkinInfo', {
      startOfMonth,
      endOfMonth,
    });

    const signInRecords = await this.signInRepository
      .createQueryBuilder('signIn')
      .where('signIn.userId = :userId', { userId })
      .andWhere('signIn.signInDate BETWEEN :start AND :end', {
        start: startOfMonth,
        end: endOfMonth,
      })
      .select(['signIn.signInDate'])
      .getMany();

    // const signInStatsRecords = await this.signInStatsRepository
    //   .createQueryBuilder('signInStats')
    //   .where('signInStats.userId = :userId', { userId })
    //   .andWhere('signInStats.currentSignInMonth = :currentMonth', {
    //     currentMonth,
    //   })
    //   .select([
    //     'signInStats.currentStreak',
    //     'signInStats.totalCheckins',
    //     'signInStats.currentSignInMonth',
    //   ])
    //   .getOne(); // Use getOne() if you expect a single record for the user
    let signInStatsRecords = await this.findStatsOneByUserId(
      userId,
      currentMonth,
    );
    // 返回签到日期列表
    return {
      signInRecords: signInRecords.map((record) => record.signInDate),
      signInStatsRecords: signInStatsRecords || {
        currentStreak: 0,
        totalCheckins: 0,
        currentSignInMonth: currentMonth,
      },
    };
  }

  /**
   * 领取会员
   * @param userId
   */
  async getGift(user: UserEntity, goodsId: string) {
    let userEntity = await this.userService.findOneByEmail(user);
    if (!userEntity) {
      throw new ServiceException('用户不存在');
    }
    const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7);
    let stats = await this.findStatsOneByUserId(user.id, currentMonth);
    if (!stats) {
      throw new ServiceException('未查到签到信息');
    }
    const { totalCheckins } = stats;
    const { hours, signInDays } = giftMap.get(goodsId)!;
    // 4️⃣ 判断用户是否满足领取条件
    if (totalCheckins < signInDays) {
      throw new ServiceException(`需要累计签到 ${signInDays} 天才能领取`);
    }

    // 5️⃣ 查询是否已领取该奖励，防止重复领取
    const existingGift = await this.signInGetGiftRepository.findOne({
      where: {
        userId: user.id,
        goodsId,
        signInGetMonth: currentMonth,
      },
    });

    if (existingGift) {
      throw new ServiceException('本月已领取该奖励，不能重复领取');
    }
    // 6️⃣ 记录领取奖励
    await this.signInGetGiftRepository.insert({
      userId: user.id,
      goodsId,
      signInGetDate: new Date().toISOString().split('T')[0], // 记录领取日期
      signInGetMonth: currentMonth, // 记录领取月份
    });
    await this.userService.addVipForUser(userEntity.email!, hours, 'hour');
    return {
      message: '领取成功',
      goodsId,
      signInGetMonth: currentMonth,
    };
  }

  /**
   * 签到
   * @param entity
   */
  async handle(entity: SignInHandleEntity) {
    await this.signInHandleRepository.save(entity);
  }

  /**
   * 访问echarts
   * @param monthYear
   * @returns
   */
  async getMonthlyAdvertisement(monthYear: string) {
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
    const signInValue = await this.signInHandleRepository
      .createQueryBuilder('sign-in-handle')
      .select('DATE(sign-in-handle.created_at)', 'date')
      .addSelect('COUNT(sign-in-handle.id)', 'revenue') // 统计每天的记录数量
      .addSelect('COUNT(DISTINCT sign-in-handle.ip_address)', 'ips') // 统计同一天内不同 IP 地址的数量
      .where(
        'sign-in-handle.created_at >= :start AND sign-in-handle.created_at <= :end',
        {
          start,
          end,
        },
      )
      .groupBy('DATE(sign-in-handle.created_at)')
      .orderBy('DATE(sign-in-handle.created_at)', 'ASC')
      .getRawMany();
    this.logger.info('锋酱的signInValue', signInValue);

    // 将查询结果格式化
    const dailyRevenue = [];
    let currentDate = dayjs(start);

    while (currentDate.isBefore(dayjs(end).add(1, 'day'))) {
      const formattedDate = currentDate.format('MM-DD');
      const record = signInValue.find(
        (item: any) => dayjs(item.date).format('MM-DD') === formattedDate,
      );
      dailyRevenue.push({
        date: formattedDate,
        revenue: record
          ? parseFloat(String((record.revenue * 1.55).toFixed(0)))
          : 0,
        ips: record ? parseFloat(String((record.ips * 1.4).toFixed(0))) : 0,
      });
      currentDate = currentDate.add(1, 'day');
    }
    const data = dailyRevenue.splice(-1);
    return dailyRevenue;
  }
}
