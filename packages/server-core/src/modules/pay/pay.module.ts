import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { InvitationEntity } from './entities/invitation.entity';
import { UserModule } from '../user/user.module';
import { ExchangeCardEntity } from './entities/exchange-card.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AvatarFrameEntity } from '../user/entities/avatar-frame.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvitationEntity,
      ExchangeCardEntity,
      UserEntity,
      AvatarFrameEntity,
    ]),
    forwardRef(() => UserModule),
    NotificationModule,
  ],
  providers: [PayService],
  controllers: [PayController],
  exports: [TypeOrmModule, PayService],
})
export class PayModule {}
