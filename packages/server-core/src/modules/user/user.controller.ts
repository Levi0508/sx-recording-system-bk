import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

import { UserEntity } from './entities/user.entity';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { Exception, Exceptions } from 'src/filters/exceptions';
import {
  UserAddVipDTO,
  UserLoginInUserNameDTO,
  UserRegisterUserNameDTO,
  UserResetPasswordDTO,
} from './dtos/user-register-username.dto';

import { UserService } from './user.service';
import { ReqPassport } from 'src/decorators/req-passport';
import { PassportEntity } from 'src/modules/passport/entities/passport.entity';
import { PassportService } from 'src/modules/passport/passport.service';
import { PermissionService } from 'src/modules/permission/permission.service';
import { WinstonService } from '@kazura/nestjs-winston';
import { generateUUID, md5 } from 'src/utils';
import { BaseController } from 'src/base/BaseController';
import { MailService } from '../email/email.service';
import { ServiceException } from 'src/common/ServiceException';
import { BuyVipDTO } from './dtos/buy-vip.dto';
import { BuyMonthDTO } from './dtos/buy-month.dto';
import { ConvertVipDTO } from './dtos/convert-vip.dto';
import { ExchangeQueryDTO } from './dtos/exchange-query.dto';
import { ReqUser } from 'src/decorators/req-user';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { FindInvitationRecordDto } from '../pay/dto/find-invitation-record.dto';
import { EncryptResponse } from 'src/interceptors/encrypt-response-Interceptor';
import { NotificationService } from '../notification/notification.service';
import { UserListDTO } from './dtos/user-list.dto';
import * as dayjs from 'dayjs';
import { AvatarFrameTypeDTO } from './dtos/wear-avatar-frame.dto';
import { AvatarFrameDTO } from './dtos/avatar-frame.dto';
import { RedisService } from '@kazura/nestjs-redis';
import { StatementAction } from 'src/decorators/statement-action';

@Controller('/user')
export class UserController extends BaseController {
  @Inject()
  private readonly passportService!: PassportService;
  @Inject()
  private readonly permissionService!: PermissionService;
  @Inject()
  private readonly notificationService!: NotificationService;
  @Inject()
  private readonly userService!: UserService;
  @Inject()
  private readonly redisService!: RedisService;
  @Inject()
  private readonly mailService!: MailService;
  @Inject()
  private readonly configService!: ConfigService;
  @Inject()
  private readonly logger!: WinstonService;

  // @Post('/upload/avatar')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: (req: any, file: any, callback: any) => {
  //         const developmentPath =
  //           '/Users/chenlifeng/skillsBank/af-Charizard/uploads/avatars';
  //         const productionPath = '/Second_EBS/uploads/avatars';
  //         const uploadPath =
  //           process.env.NODE_ENV === 'development'
  //             ? developmentPath
  //             : productionPath;
  //         if (!fs.existsSync(uploadPath)) {
  //           fs.mkdirSync(uploadPath, { recursive: true });
  //         }
  //         callback(null, uploadPath);
  //       },
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix =
  //           'FIRST-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         callback(null, `${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //     limits: {
  //       fileSize: 1024 * 1024 * 10, // 限制文件大小为 10MB
  //     },
  //     fileFilter: (req, file, callback) => {
  //       // 检查文件类型
  //       const allowedMimeTypes = ['image/jpeg', 'image/png'];
  //       if (allowedMimeTypes.includes(file.mimetype)) {
  //         callback(null, true);
  //       } else {
  //         // callback(new Error('仅支持上传 JPEG 和 PNG 格式的文件'));
  //       }
  //     },
  //   }),
  // )
  // async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
  //   const avatarPath = file?.path || '';
  //   this.logger.info('avatarPath', avatarPath);
  //   return this.success({ avatarPath });
  // }

  @Post('/upload/avatar')
  async updateUserInfo(
    @ReqUser(true)
    user: UserEntity,
    @ProtocolResource() resource: { nickname: string },
  ) {
    const { nickname } = resource;
    this.logger.info('锋酱的nickname', nickname);

    const result = await this.userService.updateAvatar(
      user.id,
      nickname,
      // avatarPath,
    );

    return this.success(result);
  }

  /**
   * 上传头像
   * @param files
   * @param createVideoDto
   * @returns
   */
  // @Post('/upload/avatar')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: (req: any, file: any, callback: any) => {
  //         const developmentPath =
  //           '/Users/chenlifeng/skillsBank/af-Charizard/uploads/avatars';
  //         const productionPath = '/Second_EBS/uploads/avatars';
  //         // const productionPath = '/www/FIRST-EBS/uploads/avatars';
  //         const uploadPath =
  //           process.env.NODE_ENV === 'development'
  //             ? developmentPath
  //             : productionPath;
  //         if (!fs.existsSync(uploadPath)) {
  //           fs.mkdirSync(uploadPath, { recursive: true });
  //         }
  //         callback(null, uploadPath);
  //       },
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix =
  //           'FIRST-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         callback(null, `${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //     limits: {
  //       fileSize: 1024 * 1024 * 1, // 限制文件大小，这里设置为 1MB
  //     },
  //     // fileFilter: (req, file, callback) => {
  //     //   // 检查文件类型
  //     //   const allowedMimeTypes = ['image/jpeg', 'image/png'];
  //     //   if (allowedMimeTypes.includes(file.mimetype)) {
  //     //     callback(null, true);
  //     //   } else {
  //     //     // callback(new Error('仅支持上传 JPEG 和 PNG 格式的文件'));
  //     //   }
  //     // },
  //   }),
  // )
  // async uploadAvatar(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body('userId') userId: number,
  //   @Body('nickname') nickname: string,
  // ) {
  //   // 调用服务层保存头像路径到用户记录
  //   const avatarPath = file?.path || '';

  //   this.logger.info('avatarPath', avatarPath);

  //   const result = await this.userService.updateAvatar(
  //     userId,
  //     nickname,
  //     avatarPath,
  //   );

  //   return this.success(result);
  // }

  @Get('/avatar/:id')
  async getAvatar(
    // @ReqUser(true)
    // user: UserEntity,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    this.logger.info('avatarId', id);

    const user = await this.userService.findAvatarById(id);

    if (!user) {
      throw new ServiceException('用户不存在');
    }
    // return this.success(user.avatar);
    res.sendFile(user.avatar!, {});
  }

  /**
   * 邮箱注册
   * @param resource
   * @param passport
   */
  @Post('/register/username')
  async registerUserName(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource() resource: UserRegisterUserNameDTO,
    @ReqPassport(true) passport: PassportEntity,
  ) {
    if (!(await this.mailService.verifyCode(resource.email, resource.code))) {
      throw new ServiceException('验证码错误');
    }
    this.logger.info('UserController->registerUserName', resource);
    const user = new UserEntity();
    user.email = resource.email;
    user.password = resource.password;
    let userInfo;
    if (resource.invitationCode) {
      userInfo = await this.userService.findOneByInvitationCode(
        resource.invitationCode,
      );
      if (!userInfo) {
        this.logger.info('registerUserName', '该验证码无效');
      } else {
        user.invitationUserId = userInfo ? userInfo.id : undefined;
      }
    }
    // user.vipDeadLine = dayjs().add(1, 'hour').toDate(); //注册送1天会员

    const userEntity = await this.userService.registerByUserName(user);
    this.logger.info(
      'UserController->registerUserName->userEntity',
      userEntity,
    );

    // if (userInfo) {
    //   await this.userService.invitationBackMoney(userInfo, userEntity, 20); //邀请返现x元
    // }
    if (!userEntity) {
      throw new Exception(Exceptions.LoginError);
    }

    // const managerUser =
    //   await this.userService.findOneByEmail('1326029085@qq.com');

    // await this.notificationService.createNotification(
    //   userEntity.generatedMaps[0].id,
    //   // managerUser?.id!,
    //   1,
    //   '系统通知',
    //   '如需领取会员打折优惠券，请联系客服Q：1946742459、3768637494。粉丝Q群：684473706，欢迎加入～',
    //   'system',
    // );

    //活动相关 《开始》显示
    const currentDate = dayjs().add(8, 'hour'); // 当前时间，UTC 时间
    const startDate = dayjs('2025-08-29T9:00:00').add(8, 'hour');
    const endDate = dayjs('2026-02-01T23:59:59').add(8, 'hour');

    if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
      this.notificationService.createSystemNotification(
        // managerUser?.id!,
        1,
        '网站改制活动来袭～-系统通知',
        '活动期间，充值即享8折返利优惠（即充值500，可得到600枚平台币，以此类推。活动时间：收到此邮件起始～2026/02/01 23:59 ）     有任何疑问，请联系客服Q：3768637494、1946742459',
        user.email,
      );
    }
    await this.passportService._incrementRegisterCount();
    //活动相关 《结束》显示
    return this.success({
      message: '注册成功',
    });
  }

  /**
   * 邮箱登陆
   * @param resource
   * @param passport
   * @returns
   */
  @Post('/login/username')
  @EncryptResponse()
  async loginByUserName(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource() resource: UserLoginInUserNameDTO,
    @ReqPassport(true) passport: PassportEntity,
    @Req() req: Request,
  ) {
    if (passport.userId) {
      throw new Exception(Exceptions.DuplicateLogin);
    }

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

    const user = new UserEntity();
    user.email = resource.email;
    user.password = resource.password;

    const userEntity = await this.userService.loginByEmail(user);

    this.logger.info('UserController->loginByEmail->userEntity', userEntity);

    if (!userEntity) {
      throw new Exception(Exceptions.LoginError);
    }
    if (userEntity.isBan()) {
      const date = dayjs(userEntity.banAccountDate)
        .add(8, 'hour')
        .format('YYYY-MM-DD HH:mm:ss');
      throw new ServiceException(
        `您因违规下载行为已被封号，解封日期：${date}，有异议请联系客服Q：1946742459`,
      );
      // throw new ServiceException(`服务器繁忙`);
    }
    await this.userService.updateUserAgentAndIP(
      userEntity.id,
      finalIp,
      req.headers['user-agent'],
    );
    //顶号
    await this.passportService.deleteByUserIdFF(userEntity.id, passport);
    await this.passportService.removeCache(passport);

    passport.userId = userEntity.id;
    const passportEntity =
      await this.passportService.updateWithUserId(passport);

    const roleEntities =
      await this.permissionService.getRolesByUserId(userEntity);

    // 获取用户已购买的月合集商品
    const purchasedMonthGoods = await this.userService.getPurchasedMonthGoods(
      userEntity.id,
    );
    const purchasedAnchorGoods = await this.userService.getPurchasedAnchorGoods(
      userEntity.id,
    );
    // 批量获取已购主播的更新包状态（供热门主播/所有主播列表页使用）
    const purchasedAnchorUpdatePackages =
      await this.userService.getBatchAnchorUpdatePackageStatus(userEntity.id);

    return this.success({
      passport: passportEntity,
      user: userEntity,
      statements:
        this.permissionService.getStatementsByRoleEntities(roleEntities),
      purchasedMonthGoods,
      purchasedAnchorGoods,
      purchasedAnchorUpdatePackages,
    });
  }

  /**
   * 登出
   * @param resource
   * @param passport
   * @returns
   */
  @Post('/logout')
  async logout(@ReqPassport(true) passport: PassportEntity) {
    if (!passport.userId) {
      throw new Exception(Exceptions.DuplicateLogin);
    }

    // 删除用户的passport信息
    await this.passportService.deleteByUserIdFF(passport.userId, passport);
    await this.passportService.removeCache(passport);

    return this.success();
  }

  /**
   * 修改密码
   * @param resource
   * @param passport
   * @returns
   */
  @Post('/reset/password')
  async resetPassword(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource() resource: UserResetPasswordDTO,
    @ReqPassport(true) passport: PassportEntity,
  ) {
    this.logger.info('UserController->loginByUserName', resource);

    if (!(await this.mailService.verifyCode(resource.email, resource.code))) {
      throw new ServiceException('验证码错误');
    }

    const userEntity = await this.userService.findOneByEmail(resource.email);
    if (!userEntity) {
      throw new ServiceException('用户不存在');
    }

    this.logger.info('UserController->loginByUserName->userEntity', userEntity);

    // 更新该用户密码
    userEntity.salt = generateUUID();
    userEntity.password = md5(resource.password + userEntity.salt);
    await this.userService.updatePasswordById(userEntity);
    //删除旧passport
    this.passportService.deleteByUserId(userEntity.id);
    this.passportService.deleteByToken(passport);

    return this.success();
  }

  /**
   * 购买vip
   * @param resource
   * @param user
   * @returns
   */
  @Post('/buy/vip')
  async addVIPDays(
    @ProtocolResource() _resource: BuyVipDTO,
    @ReqUser(true) _user: UserEntity,
  ) {
    // 暂时关闭VIP兑换功能
    throw new ServiceException('该功能暂时关闭');

    // const { goodsId } = resource;
    // await this.userService.addVIPDays(user, goodsId);
    // return this.success();
  }
  /**
   * 购买月合集商品
   * @param resource
   * @param user
   * @returns
   */
  @Post('/buy/monthGoods')
  async buyMonthGoods(
    @ProtocolResource() resource: BuyMonthDTO,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { goodsId } = resource;

    const result = await this.userService.buyMonthGoods(user, goodsId);
    return this.success({ url: result.url });
  }
  /**
   * 购买主播合集商品
   * @param resource
   * @param user
   * @returns
   */
  @Post('/buy/anchorGoods')
  async buyAnchorGoods(
    @ProtocolResource() resource: BuyMonthDTO,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { goodsId, includeUpdate } = resource;

    const result = await this.userService.buyAnchorGoods(
      user,
      goodsId,
      includeUpdate || false,
    );
    return this.success({ url: result.url });
  }

  /**
   * 获取主播合集商品URL（用于未购买用户查看）
   * @param resource
   * @param user
   * @returns
   */
  @Post('/get/anchorGoodsUrl')
  async getAnchorGoodsUrl(
    @ProtocolResource() resource: BuyMonthDTO,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { goodsId } = resource;
    const url = await this.userService.getAnchorGoodsUrl(user.id, goodsId);
    return this.success({ url });
  }

  /**
   * 获取主播合集商品的购买详情
   * @param resource
   * @param user
   * @returns
   */
  @Post('/get/anchorGoodsPurchaseInfo')
  async getAnchorGoodsPurchaseInfo(
    @ProtocolResource() resource: BuyMonthDTO,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { goodsId } = resource;
    const info = await this.userService.getAnchorGoodsPurchaseInfo(
      user.id,
      goodsId,
    );
    // 如果返回 null，返回默认值而不是 null，避免解密失败
    if (!info) {
      return this.success({
        hasUpdatePackage: false,
        canAccess: false,
        url: null,
        allowUpdate: true,
      });
    }
    return this.success(info);
  }

  /**
   * 热门主播：按销量 Top12（vip 库聚合）
   */
  @Post('/get/hotAnchors')
  async getHotAnchors() {
    const goodsIds = await this.userService.getHotAnchorGoodsIds(12);
    return this.success(goodsIds);
  }

  /**
   * 最新主播（上新）：手动维护列表
   */
  @Post('/get/newAnchors')
  async getNewAnchors() {
    const goodsIds = this.userService.getNewAnchorGoodsIds();
    return this.success(goodsIds);
  }

  /**
   * 购买主播合集后续更新包
   * @param resource
   * @param user
   * @returns
   */
  @Post('/buy/anchorUpdatePackage')
  async buyAnchorUpdatePackage(
    @ProtocolResource() resource: BuyMonthDTO,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { goodsId } = resource;
    await this.userService.buyAnchorUpdatePackage(user, goodsId);
    return this.success();
  }

  /**
   * 购买头像框
   * @param resource
   * @param user
   * @returns
   */
  @Post('/buy/avatar_frame')
  async buyAvatarFrame(
    @ProtocolResource() resource: AvatarFrameDTO,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { goodsId, isWear } = resource;

    await this.userService.buyAvatarFrame(user, goodsId, isWear);
    return this.success();
  }

  /**
   *  查询购买记录
   * @param user
   * @returns
   */
  @Post('/buy/order')
  @EncryptResponse()
  async getOrder(
    @ProtocolResource() resource: FindInvitationRecordDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { currentPage, pageSize } = resource;

    const result = await this.userService.getOrder(user, currentPage, pageSize);
    return this.success(result);
  }

  @Post('/find/userId')
  @EncryptResponse()
  async findOne(
    @ProtocolResource() resource: { userId: number },
    @ReqUser(true)
    user: UserEntity,
  ) {
    const result = await this.userService.findOneById(resource.userId);
    if (!result) {
      throw new ServiceException('用户不存在');
    }
    return this.success({
      avatar: result.avatar
        ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${result.id}`
        : null,
      avatarFrame: result.avatarFrame,
      id: result.id,
      nickname: result.nickname,
      vipDeadLine: result.vipDeadLine,
      createdAt: result.createdAt,
      vipType: result.vipType,
    });
  }

  // @Post('/pay')
  // async pay(
  //   @ProtocolResource() resource: { price: number },
  //   @ReqUser(true)
  //   user: UserEntity,
  // ) {
  //   await this.userService.pay(user, resource.price);
  //   return this.success();
  // }
  @Get('/register/info')
  async getRegisterInfo() {
    const info = await this.userService.getRegisterInfo();
    return this.success(info);
  }

  @Post('addVip')
  @StatementAction('user:add:addVip')
  async addVip(@ProtocolResource() resource: { days: number }) {
    const { days } = resource;
    await this.userService.addVip(days);
    return this.success();
  }

  /**
   * 所有vip用户增加天数
   * @param body
   * @param req
   * @returns
   */
  @Post('addVip/forVip')
  @StatementAction('user:add:addVipForVip')
  async addVipForVip(@ProtocolResource() resource: { days: number }) {
    const { days } = resource;
    await this.userService.addVipForVip(days);
    return this.success();
  }

  /**
   * 给某个用户增加vip天数
   * @param resource
   * @param user
   * @returns
   */
  @Post('addVip/forUser')
  @StatementAction('user:add:addVipForUser')
  async addVipForUser(@ProtocolResource() resource: UserAddVipDTO) {
    const { email, days, type } = resource;

    await this.userService.addVipForUser(email, days, type);

    return this.success();
  }

  @Post('/list')
  @EncryptResponse()
  async getUsers(
    @ProtocolResource()
    resource: UserListDTO,
  ) {
    const { currentPage, pageSize, nickname, email, ip, isVip, facility, id } =
      resource;
    const { list, totalCount } = await this.userService.getUsers(
      currentPage,
      pageSize,
      {
        nickname,
        email,
        ip,
        isVip,
        facility,
        id,
      },
    );

    return this.success({
      list,
      totalCount,
    });
  }
  @Post('/vip/top')
  @EncryptResponse()
  async getTopThreeUsers() {
    const data = await this.userService.getTopThreeUserDetails();
    this.logger.info('锋酱的data', data);
    const userList = data.map((item) => ({
      avatar: item.avatar
        ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${item.id}`
        : null,
      id: item.id,
      nickname: item.nickname,
      vipDeadLine: item.vipDeadLine,
      createdAt: item.createdAt,
      vipType: item.vipType,
      payTotal: item.payTotal,
      avatarFrame: item.avatarFrame,
    }));

    return this.success(userList);
  }

  /**
   * 穿戴头像
   * @returns
   */
  @Post('/wear_avatar_frame')
  @EncryptResponse()
  async wearHandler(
    @ProtocolResource()
    resource: AvatarFrameTypeDTO,
    @ReqUser(true)
    user: UserEntity,
  ) {
    this.logger.info('锋酱的resource', resource);

    const data = await this.userService.wearHandler(
      user,
      resource.avatar_frame_type,
    );

    return this.success(data);
  }

  /**
   * 获取用户拥有的头像框
   * @param user
   * @returns
   */
  @Post('/avatar_frames')
  @EncryptResponse()
  async getAvatarFramesList(
    @ReqUser(true)
    user: UserEntity,
  ) {
    const list = await this.userService.getAvatarFrame(user.id);

    return this.success(list);
  }

  /**
   * 更新积分
   * @returns
   */
  @Get('/updateUserPointsBasedOnPayTotal')
  async updateUserPointsBasedOnPayTotal() {
    const list = await this.userService.updateUserPointsBasedOnPayTotal();

    return this.success(list);
  }

  /**
   * 封号
   * @param resource
   * @param user
   * @returns
   */
  @Post('ban/account')
  @StatementAction('user:ban:banAccount')
  async banAccount(@ProtocolResource() resource: UserAddVipDTO) {
    const { email, days } = resource;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new ServiceException('用户不存在');
    }

    await this.userService.banAccount(email, days!, user);

    const passport = await this.passportService.findOneByUserId(user.id);
    this.logger.info('锋酱的passport', {
      user,
      passport,
    });

    if (passport) {
      await this.passportService.deleteByUserIdFF(user.id, passport);
      await this.passportService.removeCache(passport);
    }
    const date = dayjs(user.banAccountDate)
      .add(8, 'hour')
      .format('YYYY-MM-DD HH:mm:ss');

    this.notificationService.createSystemNotification(
      1,
      '账号封禁-系统通知',
      `因系统检测您有违规下载等行为，已对您的账号封禁 ${days} 天，解封日期：${date}，有异议请联系客服Q：1946742459`,
      user.email,
    );

    return this.success();
  }

  /**
   * 解封
   * @param resource
   * @param user
   * @returns
   */
  @Post('deblocking/account')
  @StatementAction('user:deblocking:deblockingAccount')
  async deblockingAccount(@ProtocolResource() resource: { email: string }) {
    const { email } = resource;

    await this.userService.deblockingAccount(email);
    this.notificationService.createSystemNotification(
      1,
      '账号解封-系统通知',
      `您的账号已解封，有问题请联系客服Q：1946742459`,
      email,
    );

    return this.success();
  }

  /**
   * 封禁IP
   * @param resource
   * @returns
   */
  @Post('/ban/ip')
  @StatementAction('user:ban:ip')
  async banIP(@ProtocolResource() resource: { ip: string }) {
    try {
      const { ip } = resource;

      // 读取现有的blacklist.conf文件
      const blacklistPath = '/etc/nginx/blacklist.conf';
      const currentContent = await fs.promises.readFile(blacklistPath, 'utf8');

      // 检查IP是否已经在黑名单中
      if (currentContent.includes(`deny ${ip};`)) {
        throw new ServiceException('该IP已经在黑名单中');
      }

      // 在文件末尾添加新的deny规则（在allow all之前）
      const newContent = currentContent.replace(
        /allow all;/,
        `deny ${ip};\n\n# 允许所有其他 IP（放在最后）\nallow all;`,
      );

      // 写入更新后的内容
      await fs.promises.writeFile(blacklistPath, newContent, 'utf8');

      // 重新加载nginx配置
      const execAsync = promisify(exec);
      await execAsync('nginx -s reload');

      return this.success();
    } catch (error) {
      this.logger.error('封禁IP失败', error);
    }
  }

  /**
   * 解封IP
   * @param resource
   * @returns
   */
  @Post('/unban/ip')
  @StatementAction('user:unban:ip')
  async unbanIP(@ProtocolResource() resource: { ip: string }) {
    try {
      const { ip } = resource;

      // 读取现有的blacklist.conf文件
      const blacklistPath = '/etc/nginx/blacklist.conf';
      const currentContent = await fs.promises.readFile(blacklistPath, 'utf8');

      // 检查IP是否在黑名单中
      if (!currentContent.includes(`deny ${ip};`)) {
        throw new ServiceException('该IP不在黑名单中');
      }

      // 移除IP的deny规则
      const newContent = currentContent.replace(`deny ${ip};\n`, '');

      // 写入更新后的内容
      await fs.promises.writeFile(blacklistPath, newContent, 'utf8');

      // 重新加载nginx配置
      const execAsync = promisify(exec);
      await execAsync('nginx -s reload');

      return this.success();
    } catch (error) {
      this.logger.error('解封IP失败', error);
    }
  }

  /**
   * 处理折算：将VIP有效期转换为平台币
   * @param resource
   * @returns
   */
  @Post('/convert/vip')
  @StatementAction('user:convert:vip')
  async convertVip(@ProtocolResource() resource: ConvertVipDTO) {
    const { email } = resource;
    const result = await this.userService.convertVipToBalance(email);
    return this.success(result);
  }

  /**
   * 查询用户兑换记录
   * @param resource
   * @returns
   */
  @Post('/exchange/query')
  // @StatementAction('user:exchange:query')
  async queryExchange(@ProtocolResource() resource: ExchangeQueryDTO) {
    const { id, email, currentPage = 1, pageSize = 30 } = resource;
    const result = await this.userService.getExchangeRecords(
      id,
      email,
      currentPage,
      pageSize,
    );
    return this.success(result);
  }

  /**
   * 记录用户点击"前往领取"的行为
   * @param resource
   * @param user
   * @returns
   */
  @Post('/record/anchorGoodsClick')
  async recordAnchorGoodsClick(
    @ProtocolResource() resource: { goodsId: string; url?: string },
    @ReqUser(true)
    user: UserEntity,
  ) {
    await this.userService.recordAnchorGoodsClick(
      user.id,
      resource.goodsId,
      resource.url,
    );
    return this.success();
  }
}
