import { HttpException, Inject, Injectable } from '@nestjs/common';
import { generateRandomCode, generateUUID, md5 } from 'src/utils';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { WinstonService } from '@kazura/nestjs-winston';
import { ServiceException } from 'src/common/ServiceException';
import * as dayjs from 'dayjs';
import { RedisService } from '@kazura/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { VipEntity } from './entities/vip.entity';
import { VisitCountEntity } from '../passport/entities/visit-count.entity';
import { AVATAR_TYPE_ENUM, VIP_TYPE_ENUM } from 'src/enum';
import {
  goodsMap,
  avatarFramesMap,
  monthGoodsMap,
  anchorGoodsMap,
  newAnchorGoodsIds,
} from 'src/utils/goods';
import { ConvertVipEntity } from './entities/convert-vip.entity';
import { AnchorGoodsClickEntity } from './entities/anchor-goods-click.entity';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private userRepository!: Repository<UserEntity>;
  @InjectRepository(VipEntity)
  private vipRepository!: Repository<VipEntity>;
  @InjectRepository(VisitCountEntity)
  private visitCountRepository!: Repository<VisitCountEntity>;
  @InjectRepository(ConvertVipEntity)
  private convertVipRepository!: Repository<ConvertVipEntity>;
  @InjectRepository(AnchorGoodsClickEntity)
  private anchorGoodsClickRepository!: Repository<AnchorGoodsClickEntity>;

  @Inject()
  private redisService!: RedisService;
  // @Inject()
  // private passportService!: PassportService;

  @Inject()
  private readonly configService!: ConfigService;

  @Inject()
  private logger!: WinstonService;

  /**
   * 上传头像
   * @param userId
   * @param avatarPath
   */
  async updateAvatar(userId: number, nickname: string) {
    // this.logger.info('锋酱的nickname', nickname);

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new ServiceException('用户不存在');
    }

    const updateData: any = {};
    // if (avatarPath) {
    //   updateData.avatar = avatarPath;
    // }
    if (nickname) {
      updateData.nickname = nickname;
    }

    await this.userRepository.update(
      { id: userId },
      {
        ...updateData,
      },
    );
    return {
      // avatar: `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${userId}`,
      nickname: nickname || user.nickname,
    };
  }

  async findAvatarById(userId: number) {
    return this.userRepository.findOneBy({ id: Number(userId) });
  }

  //用户名登录
  async loginByEmail(user: UserEntity) {
    const entity = await this.findOneByEmail(user);
    this.logger.info('UserService->loginByEmail', entity);
    if (entity) {
      const password_salt = md5(user.password! + entity.salt!);
      this.logger.info(
        'UserService->loginByEmail->password_salt',
        password_salt,
      );
      if (password_salt === entity.password) {
        this.logger.info('entity', entity);
        entity.avatar = entity.avatar
          ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${entity.id}`
          : undefined;
        return entity;
      }
    }
    return null;
  }
  //用户名注册
  async registerByUserName(user: UserEntity) {
    return this.createByUserName(user);
  }

  /**
   * 邮箱注册
   * 如果已经注册过，直接返回。否则创建用户
   * @param user
   * @returns
   */
  async createByEmail(user: UserEntity | string): Promise<UserEntity> {
    // 如果已经注册过，直接返回
    let userEntity = await this.findOneByEmail(user);

    if (userEntity) {
      return userEntity;
    }

    const email = user instanceof UserEntity ? user.email : user;

    await this.userRepository.insert({
      email,
      nickname: user instanceof UserEntity ? user.nickname : undefined,
      avatar: user instanceof UserEntity ? user.avatar : undefined,
    });

    // 注册成功后，再次查询
    userEntity = await this.findOneByEmail(user);

    if (!userEntity) {
      throw new HttpException('创建用户失败', -400);
    }

    return userEntity;
  }

  async updateUserAgentAndIP(
    userId: number,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ServiceException('账号不存在');
    }
    user.userAgent = userAgent;
    user.ipAddress = ipAddress;

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }
  findOneById(user: UserEntity | number) {
    const id = user instanceof UserEntity ? user.id : user;

    return this.userRepository.findOneBy({ id });
  }

  findByIP(ipAddress: string): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { ipAddress } });
  }

  findOneByUserName(user: UserEntity | string) {
    const username = user instanceof UserEntity ? user.username : user;

    return this.userRepository.findOneBy({ username });
  }

  findOneByPhone(user: UserEntity | string) {
    const phone = user instanceof UserEntity ? user.phone : user;
    return this.userRepository.findOneBy({ phone });
  }

  findOneByEmail(user: UserEntity | string) {
    const email = user instanceof UserEntity ? user.email : user;

    return this.userRepository.findOneBy({ email });
  }

  findOneByInvitationCode(invitationCode: string) {
    return this.userRepository.findOneBy({
      defaultInvitationCode: invitationCode,
    });
  }

  createByUserName(user: UserEntity) {
    const { username, password, email, invitationUserId, vipDeadLine } = user;

    const salt = generateUUID();
    const password_salt = md5(password + salt);

    const defaultInvitationCode = generateRandomCode(); //注册默认生成的邀请码

    return this.userRepository.insert({
      username,
      password: password_salt,
      salt,
      email,
      invitationUserId,
      defaultInvitationCode, //邀请码
      vipDeadLine,
    });
  }

  createByPhone(user: UserEntity | string) {
    const phone = user instanceof UserEntity ? user.phone : user;

    return this.userRepository.insert({
      phone,
    });
  }

  updateById(user: UserEntity) {
    const { id, nickname, avatar } = user;
    return this.userRepository.update(
      { id },
      {
        nickname,
        avatar,
      },
    );
  }

  /**
   * 重置密码
   * @param user
   * @returns
   */
  updatePasswordById(user: UserEntity) {
    const { id, password, salt } = user;
    return this.userRepository.update(
      { id },
      {
        password,
        salt,
      },
    );
  }

  /**
   * 购买vip
   * @param user
   * @param days
   * @param amount
   */
  async addVIPDays(user: UserEntity, goodsId: string) {
    const goods = goodsMap.get(goodsId);
    if (!goods) {
      throw new ServiceException('商品不存在');
    }
    const { price, days } = goods;

    if (user.money < price) {
      throw new ServiceException('当前余额不足');
    }

    const redisClient = this.redisService.getClient();
    // 尝试获取锁
    const lockKey = `user:${user.id}:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    try {
      if (acquiredLock === 1) {
        await redisClient.expire(lockKey, 5); //上锁5s

        const now = dayjs();
        let newVipDeadLine: dayjs.Dayjs;

        // if (!user.vipDeadLine || dayjs(user.vipDeadLine).isBefore(now)) {
        //   newVipDeadLine = now.add(days, 'day');
        // } else {
        //   newVipDeadLine = dayjs(user.vipDeadLine).add(days, 'day');
        // }
        const vipLevels = {
          [VIP_TYPE_ENUM.MONTH]: 1,
          [VIP_TYPE_ENUM.QUARTER]: 2,
          [VIP_TYPE_ENUM.YEAR]: 3,
          [VIP_TYPE_ENUM.THREE_YEARS]: 4,
          [VIP_TYPE_ENUM.PERMANENT]: 5,
        };

        // 计算新VIP等级
        let newVipType: VIP_TYPE_ENUM;
        if (days === 31) newVipType = VIP_TYPE_ENUM.MONTH;
        else if (days === 93) newVipType = VIP_TYPE_ENUM.QUARTER;
        else if (days === 366) newVipType = VIP_TYPE_ENUM.YEAR;
        else if (days === 999999) newVipType = VIP_TYPE_ENUM.PERMANENT;

        const newVipLevel = vipLevels[newVipType!];

        // 获取当前用户VIP等级
        const currentVipType = user.vipType || '';
        const currentVipLevel = currentVipType ? vipLevels[currentVipType] : 0;

        // 判断现有VIP是否已经过期
        const isCurrentVIPExpired = !user.isVIP();

        // 续费逻辑
        if (isCurrentVIPExpired) {
          // 当前VIP已过期，直接设置为新购买的VIP
          newVipDeadLine = now.add(days, 'day');
          user.vipType = newVipType!;
        } else if (newVipLevel > currentVipLevel) {
          // 如果新购买的VIP等级高于当前，延长到期时间并更新为新的VIP类型
          newVipDeadLine = dayjs(user.vipDeadLine).add(days, 'day');
          user.vipType = newVipType!;
        } else if (newVipLevel === currentVipLevel) {
          // 如果购买的VIP与当前相同，延长当前VIP的到期时间
          newVipDeadLine = dayjs(user.vipDeadLine).add(days, 'day');
        } else {
          // 如果购买的VIP低于当前等级，延长当前到期时间，但不更改VIP类型
          newVipDeadLine = dayjs(user.vipDeadLine).add(days, 'day');
        }

        user.vipDeadLine = newVipDeadLine.toDate();
        user.money -= price;

        await this.userRepository.update(
          { id: user.id },
          {
            vipDeadLine: user.vipDeadLine,
            money: user.money,
            vipType: user.vipType,
          },
        );

        await this.vipRepository.insert({
          userId: user.id,
          goodsId,
          price,
          name: goods.name,
          goodsType: 'vip',
        });

        await redisClient.del(lockKey);
      } else {
        throw new ServiceException('上一次购买尚未完成，请稍后再试');
      }
    } catch (err) {
      await redisClient.del(lockKey);
      throw new ServiceException('上一次购买尚未完成，请稍后再试');
    }
  }
  /**
   * 获取用户已购买的月合集商品
   * @param userId
   * @returns 返回 goodsId -> url 的映射
   */
  async getPurchasedMonthGoods(userId: number) {
    const purchasedGoods = await this.vipRepository.find({
      where: {
        userId,
        goodsType: 'month',
      },
    });

    const goodsMap = new Map<string, string>();
    for (const goods of purchasedGoods) {
      const monthGood = monthGoodsMap.get(goods.goodsId);
      if (monthGood) {
        goodsMap.set(goods.goodsId, monthGood.url);
      }
    }

    return Object.fromEntries(goodsMap);
  }

  /**
   * 获取用户已购买的主播合集商品
   * @param userId
   * @returns
   */
  async getPurchasedAnchorGoods(userId: number) {
    const purchasedGoods = await this.vipRepository.find({
      where: {
        userId,
        goodsType: 'anchor',
      },
    });

    const goodsMap = new Map<string, string>();
    const now = dayjs();
    const oneMonthAgo = now.subtract(1, 'month');

    for (const goods of purchasedGoods) {
      const anchorGood = anchorGoodsMap.get(goods.goodsId);
      if (anchorGood) {
        // 检查是否可以访问URL
        // 1. 如果包了更新，始终可以访问
        // 2. 如果没包更新，但购买时间在一个月内，可以访问
        // 3. 如果没包更新，且购买时间超过一个月，不能访问
        const purchaseDate = goods.purchaseDate
          ? dayjs(goods.purchaseDate)
          : dayjs(goods.createdAt);
        const canAccess =
          goods.hasUpdatePackage || purchaseDate.isAfter(oneMonthAgo);

        if (canAccess) {
          goodsMap.set(goods.goodsId, anchorGood.url);
        } else {
          // 超过一个月且未包更新，返回空字符串表示已过期
          goodsMap.set(goods.goodsId, '');
        }
      }
    }

    return Object.fromEntries(goodsMap);
  }

  /**
   * 获取主播合集商品的URL（用于未购买用户查看）
   * @param userId
   * @param goodsId
   * @returns
   */
  async getAnchorGoodsUrl(userId: number, goodsId: string) {
    // 检查用户是否已购买
    const purchase = await this.vipRepository.findOne({
      where: {
        userId,
        goodsId,
        goodsType: 'anchor',
      },
    });

    if (purchase) {
      // 如果已购买，检查是否可以访问
      const anchorGood = anchorGoodsMap.get(goodsId);
      if (!anchorGood) {
        return null;
      }

      const now = dayjs();
      const oneMonthAgo = now.subtract(1, 'month');
      const purchaseDate = purchase.purchaseDate
        ? dayjs(purchase.purchaseDate)
        : dayjs(purchase.createdAt);
      const canAccess =
        purchase.hasUpdatePackage || purchaseDate.isAfter(oneMonthAgo);

      return canAccess ? anchorGood.url : null;
    }

    // 未购买，返回URL（允许访问）
    const anchorGood = anchorGoodsMap.get(goodsId);
    return anchorGood ? anchorGood.url : null;
  }

  /**
   * 获取主播合集商品的购买详情
   * @param userId
   * @param goodsId
   * @returns
   */
  async getAnchorGoodsPurchaseInfo(userId: number, goodsId: string) {
    const purchase = await this.vipRepository.findOne({
      where: {
        userId,
        goodsId,
        goodsType: 'anchor',
      },
    });

    if (!purchase) {
      return null;
    }

    const anchorGood = anchorGoodsMap.get(goodsId);
    if (!anchorGood) {
      return null;
    }

    const now = dayjs();
    const oneMonthAgo = now.subtract(1, 'month');
    const purchaseDate = purchase.purchaseDate
      ? dayjs(purchase.purchaseDate)
      : dayjs(purchase.createdAt);
    const canAccess =
      purchase.hasUpdatePackage || purchaseDate.isAfter(oneMonthAgo);

    return {
      hasUpdatePackage: purchase.hasUpdatePackage || false,
      canAccess,
      url: canAccess ? anchorGood.url : null,
      allowUpdate: anchorGood.allowUpdate !== false, // 默认支持更新，除非明确设置为 false
    };
  }

  /**
   * 购买月合集商品
   * @param user
   * @param goodsId
   * @returns
   */
  async buyMonthGoods(user: UserEntity, goodsId: string) {
    const monthGoods = monthGoodsMap.get(goodsId);
    if (!monthGoods) {
      throw new ServiceException('商品不存在');
    }

    // 检查用户是否已经购买过该商品
    const existingPurchase = await this.vipRepository.findOne({
      where: {
        userId: user.id,
        goodsId,
        goodsType: 'month',
      },
    });

    if (existingPurchase) {
      throw new ServiceException('您已购买过该商品，无需重复购买');
    }

    const { price, name, url } = monthGoods;

    // 数据库中money是以10倍存储的（例如68元存储为680），需要将价格乘以10
    const priceInStorageFormat = price * 10;

    if (user.money < priceInStorageFormat) {
      throw new ServiceException('当前余额不足');
    }

    const redisClient = this.redisService.getClient();
    const lockKey = `user:${user.id}:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    try {
      if (acquiredLock === 1) {
        await redisClient.expire(lockKey, 5);

        user.money -= priceInStorageFormat;

        await this.userRepository.update(
          { id: user.id },
          {
            money: user.money,
          },
        );

        await this.vipRepository.insert({
          userId: user.id,
          goodsId,
          price,
          name,
          goodsType: 'month',
        });

        await redisClient.del(lockKey);
        return { url }; // 返回月合集商品的URL
      } else {
        throw new ServiceException('上一次购买尚未完成，请稍后再试');
      }
    } catch (err) {
      await redisClient.del(lockKey);
      throw new ServiceException('上一次购买尚未完成，请稍后再试');
    }
  }
  /**
   * 购买主播合集商品
   * @param user
   * @param goodsId
   * @returns
   */
  async buyAnchorGoods(
    user: UserEntity,
    goodsId: string,
    includeUpdate: boolean = false,
  ) {
    const anchorGoods = anchorGoodsMap.get(goodsId);
    if (!anchorGoods) {
      throw new ServiceException('商品不存在');
    }

    // 检查用户是否已经购买过该商品
    const existingPurchase = await this.vipRepository.findOne({
      where: {
        userId: user.id,
        goodsId,
        goodsType: 'anchor',
      },
    });

    if (existingPurchase) {
      throw new ServiceException('您已购买过该商品，无需重复购买');
    }

    // 如果选择了包更新，检查该主播是否支持更新
    if (includeUpdate && anchorGoods.allowUpdate === false) {
      throw new ServiceException('该主播合集不支持后续更新');
    }

    const { price, name, url } = anchorGoods;

    // 如果包后续更新，价格增加40
    const finalPrice = includeUpdate ? price + 40 : price;

    // 数据库中money是以10倍存储的（例如68元存储为680），需要将价格乘以10
    const priceInStorageFormat = finalPrice * 10;

    if (user.money < priceInStorageFormat) {
      throw new ServiceException('当前余额不足');
    }

    const redisClient = this.redisService.getClient();
    const lockKey = `user:${user.id}:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    try {
      if (acquiredLock === 1) {
        await redisClient.expire(lockKey, 5);

        user.money -= priceInStorageFormat;

        await this.userRepository.update(
          { id: user.id },
          {
            money: user.money,
          },
        );

        await this.vipRepository.insert({
          userId: user.id,
          goodsId,
          price: finalPrice,
          name,
          goodsType: 'anchor',
          hasUpdatePackage: includeUpdate,
          purchaseDate: new Date(),
        });

        await redisClient.del(lockKey);
        return { url }; // 返回主播合集商品的URL
      } else {
        throw new ServiceException('上一次购买尚未完成，请稍后再试');
      }
    } catch (err) {
      await redisClient.del(lockKey);
      throw new ServiceException('上一次购买尚未完成，请稍后再试');
    }
  }

  /**
   * 购买主播合集后续更新包
   * @param user
   * @param goodsId
   */
  async buyAnchorUpdatePackage(user: UserEntity, goodsId: string) {
    // 检查用户是否已购买该商品
    const existingPurchase = await this.vipRepository.findOne({
      where: {
        userId: user.id,
        goodsId,
        goodsType: 'anchor',
      },
    });

    if (!existingPurchase) {
      throw new ServiceException('请先购买该商品');
    }

    // 检查该主播是否支持更新
    const anchorGood = anchorGoodsMap.get(goodsId);
    if (!anchorGood || anchorGood.allowUpdate === false) {
      throw new ServiceException('该主播合集不支持后续更新');
    }

    // 检查是否已经包了更新
    if (existingPurchase.hasUpdatePackage) {
      throw new ServiceException('您已购买后续更新包，无需重复购买');
    }

    // 后续更新包价格为40
    const updatePackagePrice = 40;
    const priceInStorageFormat = updatePackagePrice * 10;

    if (user.money < priceInStorageFormat) {
      throw new ServiceException('当前余额不足');
    }

    const redisClient = this.redisService.getClient();
    const lockKey = `user:${user.id}:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    try {
      if (acquiredLock === 1) {
        await redisClient.expire(lockKey, 5);

        user.money -= priceInStorageFormat;

        await this.userRepository.update(
          { id: user.id },
          {
            money: user.money,
          },
        );

        // 更新购买记录，标记为已包更新
        await this.vipRepository.update(
          {
            userId: user.id,
            goodsId,
            goodsType: 'anchor',
          },
          {
            hasUpdatePackage: true,
            price: existingPurchase.price + updatePackagePrice,
          },
        );

        await redisClient.del(lockKey);
        return { success: true };
      } else {
        throw new ServiceException('上一次购买尚未完成，请稍后再试');
      }
    } catch (err) {
      await redisClient.del(lockKey);
      throw new ServiceException('上一次购买尚未完成，请稍后再试');
    }
  }

  /**
   * 购买头像框
   * @param user
   * @param goodsId
   */
  async buyAvatarFrame(
    user: UserEntity,
    goodsId: AVATAR_TYPE_ENUM,
    isWear?: boolean,
  ) {
    const goods = avatarFramesMap.get(goodsId);
    if (!goods) {
      throw new ServiceException('商品不存在');
    }
    const { price, name } = goods;

    if (user.money < price) {
      throw new ServiceException('当前余额不足');
    }
    const avatarFrames = await this.vipRepository.find({
      where: {
        userId: user.id,
        goodsId: name,
      },
    });
    this.logger.info('锋酱的avatarFrames', avatarFrames);

    if (avatarFrames.length > 0) {
      throw new ServiceException('该头像已拥有');
    }

    const redisClient = this.redisService.getClient();
    // 尝试获取锁
    const lockKey = `user:${user.id}:lock`;
    const acquiredLock = await this.redisService
      .getClient()
      .setnx(lockKey, 'locked');

    try {
      if (acquiredLock === 1) {
        await redisClient.expire(lockKey, 5); //上锁5s

        user.money -= price;

        await this.userRepository.update(
          { id: user.id },
          {
            money: user.money,
            avatarFrame: (isWear ? name : user.avatarFrame) as any,
          },
        );

        // await this.avatarFrameRepository.insert({
        //   userId: user.id,
        //   avatarFrame: goodsId,
        //   price,
        // });
        await this.vipRepository.insert({
          userId: user.id,
          goodsId,
          price,
          name: goods.name,
          goodsType: 'avatar_frame',
        });
      } else {
        throw new ServiceException('上一次购买尚未完成，请稍后再试');
      }
    } catch (err) {
      throw new ServiceException('上一次购买尚未完成，请稍后再试');
    }
  }

  /**
   * 查询购买记录
   * @param user
   * @returns
   */
  async getOrder(
    user: UserEntity,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 10,
  ) {
    const queryBuilder = this.vipRepository
      .createQueryBuilder('video_upload')
      .where('video_upload.userId = :userId', { userId: user.id });
    const totalCount = await queryBuilder.getCount();

    const list = await queryBuilder
      .orderBy('video_upload.createdAt', 'DESC') // 按时间倒序排序
      .skip((currentPage - 1) * pageSize) // 跳过的记录条数
      .take(pageSize) // 返回的记录条数
      .getMany();

    return {
      list,
      totalCount,
    };
  }

  /**
   * 查询用户兑换记录（根据用户ID或邮箱，如果都没有则查询全部）
   * @param id 用户ID
   * @param email 用户邮箱
   * @param currentPage 当前页码
   * @param pageSize 每页数量
   * @returns
   */
  async getExchangeRecords(
    id?: number,
    email?: string,
    currentPage: number = 1,
    pageSize: number = 30,
  ) {
    let userId: number | undefined;
    let isFilterByUser = false;

    // 根据ID或邮箱查询用户ID
    if (id) {
      userId = id;
      isFilterByUser = true;
    } else if (email) {
      // 先通过邮箱查找用户ID
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        return {
          list: [],
          totalCount: 0,
        };
      }
      userId = user.id;
      isFilterByUser = true;
    }

    const queryBuilder = this.vipRepository.createQueryBuilder('vip');

    // 如果有用户ID条件，则过滤
    if (isFilterByUser && userId) {
      queryBuilder.where('vip.userId = :userId', { userId });
    }

    const totalCount = await queryBuilder.getCount();

    const list = await queryBuilder
      .orderBy('vip.createdAt', 'DESC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // 获取所有用户信息
    const userIds = [...new Set(list.map((item) => item.userId))];
    const users = await this.userRepository.find({
      where: userIds.map((uid) => ({ id: uid })),
    });

    // 将用户信息添加到兑换记录中
    const listWithUserInfo = list.map((item) => {
      const user = users.find((u) => u.id === item.userId);
      return {
        ...item,
        userEmail: user?.email || '',
        userNickname: user?.nickname || '',
      };
    });

    return {
      list: listWithUserInfo,
      totalCount,
    };
  }

  /**
   * 更新用户的邀请码
   */
  async updateInvitationCode(user: UserEntity) {
    const userInfo = await this.userRepository.findOneBy({ id: user.id });

    if (!userInfo) {
      throw new ServiceException('用户不存在');
    }

    const cacheKey = `invitation:${user.id}:reset`;
    const cachedData = await this.redisService.getClient().get(cacheKey);

    if (cachedData) {
      this.logger.info(`Cache hit for key:`, cacheKey);
      throw new ServiceException('一天只能重置一次邀请码');
    }
    await this.redisService
      .getClient()
      .set(cacheKey, cacheKey, 'EX', 24 * 60 * 60); // 12 小时

    const defaultInvitationCode = generateRandomCode();
    await this.userRepository.update(
      { id: userInfo.id },
      {
        defaultInvitationCode,
      },
    );

    return {
      invitationCode: defaultInvitationCode,
    };
  }
  /**
   * 网站日活+注册人数
   * @param user
   * @returns
   */
  async getRegisterInfo() {
    // 获取所有注册用户的数量
    const registeredUserCount = await this.userRepository.count();

    // 获取当天的日期
    const today = dayjs().format('YYYY-MM-DD');
    const startOfDay = dayjs().startOf('day').toDate(); // 今天00:00:00
    const endOfDay = dayjs().endOf('day').toDate(); // 今天23:59:59

    // 获取当天的访问次数
    const visitRecord = await this.visitCountRepository.findOne({
      where: { recordDate: today },
    });
    const visitCount = visitRecord ? visitRecord.count : 0;
    // const playTimesTotal = visitRecord ? visitRecord.playTimesTotal : 0;
    // const registerCount = visitRecord ? visitRecord.registerCount : 0;
    // 获取当天的注册人数
    const dailyRegisteredUsers = await this.userRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });
    return {
      registeredUserCount,
      visitCount,
      dailyRegisteredUsers,
      // playTimesTotal,
      // registerCount,
    };
  }

  /**
   * 支付
   * @param user
   * @param price
   */
  // async pay(user: UserEntity, price: number) {
  //   const userInfo = await this.userRepository.findOneBy({ id: user.id });

  //   if (!userInfo) {
  //     throw new ServiceException('用户不存在');
  //   }

  //   if (userInfo.invitationUserId) {
  //     // 计算返利金额，这里假设返利比例为 10%
  //     const rebateAmount = price * 10 * 0.1;

  //     // 更新邀请人的账户余额
  //     await this.userRepository.increment(
  //       { id: userInfo.invitationUserId },
  //       'money',
  //       rebateAmount,
  //     );

  //     // 记录返利信息到 InvitationEntity
  //     const invitation = new InvitationEntity();
  //     invitation.userId = user.id; // 被邀请人的用户ID
  //     invitation.invitationId = userInfo.invitationUserId; // 邀请人的用户ID
  //     invitation.reward = rebateAmount;
  //     await this.invitationRepository.save(invitation);
  //   }

  //   await this.userRepository.update(
  //     { id: userInfo.id },
  //     {
  //       money: userInfo.money + price * 10,
  //     },
  //   );
  // }
  /**
   * 群体增加vip天数
   * @param days
   */
  async addVip(days: number): Promise<void> {
    const users = await this.userRepository.find();

    for (const user of users) {
      const now = dayjs();
      let newVipDeadLine: dayjs.Dayjs;

      if (!user.vipDeadLine || dayjs(user.vipDeadLine).isBefore(now)) {
        newVipDeadLine = now.add(days, 'day');
      } else {
        newVipDeadLine = dayjs(user.vipDeadLine).add(days, 'day');
      }

      user.vipDeadLine = newVipDeadLine.toDate();

      await this.userRepository.update(user.id, {
        vipDeadLine: user.vipDeadLine,
      });
    }
  }

  /**
   * 邀请者加2平台币
   * @param userInfo//邀请人
   * @param user//注册人
   * @returns
   */
  // async invitationBackMoney(userInfo: UserEntity, user: any, money: number) {
  //   this.logger.info('invitationBackMoney', { userInfo, user });

  //   const invitationRecord = new InvitationEntity();
  //   invitationRecord.userId = user.identifiers[0].id; // 被邀请人
  //   invitationRecord.userNickname = '';
  //   invitationRecord.invitationId = userInfo.id; // 邀请人
  //   invitationRecord.reward = money; // 返利金额

  //   await this.invitationRepository.save(invitationRecord);

  //   await this.userRepository.update(
  //     { id: userInfo.id },
  //     {
  //       money: userInfo.money + money,
  //     },
  //   );
  // }
  /**
   * 所有vip用户增加天数
   * @param days
   */
  async addVipForVip(days: number): Promise<void> {
    const users = await this.userRepository.find();

    const now = dayjs();

    for (const user of users) {
      // Check if the user is currently a VIP
      if (
        user.vipDeadLine &&
        dayjs(user.vipDeadLine).isAfter(now) &&
        user.vipType
      ) {
        // Calculate new VIP deadline
        const newVipDeadLine = dayjs(user.vipDeadLine).add(days, 'day');

        // Update user's VIP deadline
        user.vipDeadLine = newVipDeadLine.toDate();
        await this.userRepository.update(user.id, {
          vipDeadLine: user.vipDeadLine,
        });
      }
    }
  }

  /**
   * 批量获取用户已购买主播的更新包状态
   * @param userId
   * @returns Record<goodsId, hasUpdatePackage>
   */
  async getBatchAnchorUpdatePackageStatus(userId: number) {
    const purchases = await this.vipRepository.find({
      where: {
        userId,
        goodsType: 'anchor',
      },
    });

    const statusMap: Record<string, boolean> = {};
    for (const purchase of purchases) {
      statusMap[purchase.goodsId] = purchase.hasUpdatePackage || false;
    }

    return statusMap;
  }

  /**
   * 热门主播：按销量（vip 库中 anchor 的购买记录数）取 Top N
   * 说明：这里的“销量”口径为 vip 表中 goodsType='anchor' 的记录数（包含是否包更新的购买）。
   */
  async getHotAnchorGoodsIds(take: number = 12): Promise<string[]> {
    const rows = await this.vipRepository
      .createQueryBuilder('vip')
      .select('vip.goodsId', 'goodsId')
      .addSelect('COUNT(1)', 'cnt')
      .where('vip.goodsType = :goodsType', { goodsType: 'anchor' })
      .groupBy('vip.goodsId')
      .orderBy('cnt', 'DESC')
      .limit(take)
      .getRawMany<{ goodsId: string; cnt: string }>();

    const ids = (rows || [])
      .map((r) => r.goodsId)
      .filter((id) => typeof id === 'string' && id.length > 0);

    // 只返回仍存在于 goods 配置里的主播
    return ids.filter((id) => anchorGoodsMap.has(id));
  }

  /**
   * 最新主播（上新）：手动维护的列表
   * - 顺序即展示顺序
   * - 会自动过滤掉不存在于 goods 配置的 id
   */
  getNewAnchorGoodsIds(): string[] {
    return (newAnchorGoodsIds || []).filter((id) => anchorGoodsMap.has(id));
  }

  /**
   * 给某个用户增加vip天数
   * @param email
   * @param days
   */
  async addVipForUser(email: string, days: number, type: any = 'day') {
    const user = await this.userRepository.findOneBy({ email });
    this.logger.info('锋酱的user', { user, email, days });

    if (!user) {
      throw new ServiceException('用户不存在');
    }

    const now = dayjs();
    let newVipDeadLine: dayjs.Dayjs;

    if (user.vipDeadLine && dayjs(user.vipDeadLine).isAfter(now)) {
      // User is already a VIP, extend the deadline
      newVipDeadLine = dayjs(user.vipDeadLine).add(days, type);
    } else {
      // User is not a VIP, set the new deadline
      newVipDeadLine = now.add(days, type);
    }

    user.vipDeadLine = newVipDeadLine.toDate();
    await this.userRepository.update(user.id, {
      vipDeadLine: user.vipDeadLine,
    });
  }

  async getUsers(
    currentPage: number = 1, // 当前页码，默认第一页
    pageSize: number = 10, // 每页显示的数量，默认10
    filter: {
      nickname?: string; // 可选的昵称过滤条件
      email?: string; // 可选的邮箱过滤条件
      ip?: string;
      isVip?: string;
      facility?: string;
      id?: string;
    },
  ) {
    const { nickname, email, ip, isVip, facility, id } = filter;

    // 构造查询条件
    const where: any = {};
    if (nickname) {
      where.nickname = Like(`%${nickname}%`); // 使用 LIKE 进行模糊查询
    }
    if (email) {
      where.email = Like(`%${email}%`); // 使用 LIKE 进行模糊查询
    }
    if (ip) {
      where.ipAddress = Like(`%${ip}%`); // 使用 LIKE 进行模糊查询
    }
    if (id) {
      where.id = Like(`%${id}%`); // 使用 LIKE 进行模糊查询
    }

    // 查询总记录数
    const totalCount = await this.userRepository.count({ where });

    // 查询符合条件的用户，分页和排序
    let list = await this.userRepository.find({
      where,
      order: { createdAt: 'DESC' }, // 根据创建时间倒序排序
      skip: (currentPage - 1) * pageSize, // 跳过当前页之前的记录
      take: pageSize, // 取出当前页的记录
    });

    if (isVip === 'TRUE') {
      list = list.filter((user) => user.isVIP()); // 过滤 VIP 用户
    } else if (isVip === 'FALSE') {
      list = list.filter((user) => !user.isVIP()); // 过滤 VIP 用户
    }

    if (facility === 'MOBILE') {
      list = list.filter((user) => user.isMobile());
    } else if (facility === 'PC') {
      list = list.filter((user) => !user.isMobile()); // 过滤 VIP 用户
    }

    // 加密邮箱函数，前后保留两个字符
    // const maskEmail = (email: string) => {
    //   const [name, domain] = email.split('@');
    //   if (name.length > 4) {
    //     return `${name.slice(0, 2)}***${name.slice(-2)}@${domain}`; // 保留前两个和后两个字符
    //   }
    //   return email; // 如果用户名长度太短，直接返回原邮箱
    // };

    const newList = list.map((item) => ({
      ...item,
      // email: maskEmail(item.email!), // 对邮箱进行掩码处理
      email: item.email!,
      isVip: item.isVIP(),
    }));

    return { list: newList, totalCount };
  }
}
