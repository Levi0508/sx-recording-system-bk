import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../passport/passport.module';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { PermissionModule } from '../permission/permission.module';
import { UserController } from './user.controller';
import { MailModule } from '../email/email.module';
import { VipEntity } from './entities/vip.entity';
import { PayModule } from '../pay/pay.module';
import { InvitationEntity } from '../pay/entities/invitation.entity';
import { VisitCountEntity } from '../passport/entities/visit-count.entity';
import { NotificationModule } from '../notification/notification.module';
import { AvatarFrameEntity } from './entities/avatar-frame.entity';
import { ExchangeCardEntity } from '../pay/entities/exchange-card.entity';
import { ConvertVipEntity } from './entities/convert-vip.entity';
import { AnchorGoodsClickEntity } from './entities/anchor-goods-click.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      VipEntity,
      InvitationEntity,
      VisitCountEntity,
      AvatarFrameEntity,
      ExchangeCardEntity,
      ConvertVipEntity,
      AnchorGoodsClickEntity,
    ]),
    forwardRef(() => MailModule),
    forwardRef(() => PayModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => PassportModule),
    // VipModule,
    PermissionModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
