import { Controller, Get, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';

import { UserEntity } from './entities/user.entity';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { Exception, Exceptions } from 'src/filters/exceptions';
import {
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
import { BaseController } from 'src/base/BaseController';
import { MailService } from '../email/email.service';
import { ServiceException } from 'src/common/ServiceException';
import { ReqUser } from 'src/decorators/req-user';
import { ConfigService } from '@nestjs/config';
import { EncryptResponse } from 'src/interceptors/encrypt-response-Interceptor';
import { generateUUID, md5 } from 'src/utils';

@Controller('/user')
export class UserController extends BaseController {
  @Inject()
  private readonly passportService!: PassportService;
  @Inject()
  private readonly permissionService!: PermissionService;
  @Inject()
  private readonly userService!: UserService;
  @Inject()
  private readonly mailService!: MailService;
  @Inject()
  private readonly configService!: ConfigService;
  @Inject()
  private readonly logger!: WinstonService;

  /**
   * 更新用户信息（昵称等）
   */
  @Post('/upload/avatar')
  async updateUserInfo(
    @ReqUser(true) user: UserEntity,
    @ProtocolResource() resource: { nickname: string },
  ) {
    const { nickname } = resource;
    const result = await this.userService.updateAvatar(user.id, nickname);
    return this.success(result);
  }

  @Get('/avatar/:id')
  async getAvatar(@Param('id') id: number, @Res() res: Response) {
    const user = await this.userService.findAvatarById(id);
    if (!user) {
      throw new ServiceException('用户不存在');
    }
    res.sendFile(user.avatar!, {});
  }

  /**
   * 邮箱注册
   */
  @Post('/register/username')
  async registerUserName(
    @ProtocolResource() resource: UserRegisterUserNameDTO,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- 需要通行证校验
    @ReqPassport(true) passport: PassportEntity,
  ) {
    if (!(await this.mailService.verifyCode(resource.email, resource.code))) {
      throw new ServiceException('验证码错误');
    }
    const user = new UserEntity();
    user.email = resource.email;
    user.password = resource.password;
    let userInfo;
    if (resource.invitationCode) {
      userInfo = await this.userService.findOneByInvitationCode(
        resource.invitationCode,
      );
      if (userInfo) {
        user.invitationUserId = userInfo.id;
      }
    }

    const userEntity = await this.userService.registerByUserName(user);
    if (!userEntity) {
      throw new Exception(Exceptions.LoginError);
    }
    return this.success({ message: '注册成功' });
  }

  /**
   * 邮箱登录
   */
  @Post('/login/username')
  @EncryptResponse()
  async loginByUserName(
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
    if (finalIp && finalIp.includes('::ffff:')) {
      finalIp = finalIp.split('::ffff:')[1];
    }

    const user = new UserEntity();
    user.email = resource.email;
    user.password = resource.password;
    const userEntity = await this.userService.loginByEmail(user);

    if (!userEntity) {
      throw new Exception(Exceptions.LoginError);
    }

    await this.userService.updateUserAgentAndIP(
      userEntity.id,
      finalIp,
      req.headers['user-agent'],
    );

    await this.passportService.deleteByUserIdFF(userEntity.id, passport);
    await this.passportService.removeCache(passport);

    passport.userId = userEntity.id;
    const passportEntity =
      await this.passportService.updateWithUserId(passport);
    const roleEntities =
      await this.permissionService.getRolesByUserId(userEntity);

    return this.success({
      passport: passportEntity,
      user: userEntity,
      statements:
        this.permissionService.getStatementsByRoleEntities(roleEntities),
    });
  }

  /**
   * 登出
   */
  @Post('/logout')
  async logout(@ReqPassport(true) passport: PassportEntity) {
    if (!passport.userId) {
      throw new Exception(Exceptions.DuplicateLogin);
    }
    await this.passportService.deleteByUserIdFF(passport.userId, passport);
    await this.passportService.removeCache(passport);
    return this.success();
  }

  /**
   * 重置密码
   */
  @Post('/reset/password')
  async resetPassword(
    @ProtocolResource() resource: UserResetPasswordDTO,
    @ReqPassport(true) passport: PassportEntity,
  ) {
    if (!(await this.mailService.verifyCode(resource.email, resource.code))) {
      throw new ServiceException('验证码错误');
    }
    const userEntity = await this.userService.findOneByEmail(resource.email);
    if (!userEntity) {
      throw new ServiceException('用户不存在');
    }

    userEntity.salt = generateUUID();
    userEntity.password = md5(resource.password + userEntity.salt);
    await this.userService.updatePasswordById(userEntity);
    this.passportService.deleteByUserId(userEntity.id);
    this.passportService.deleteByToken(passport);
    return this.success();
  }
}
