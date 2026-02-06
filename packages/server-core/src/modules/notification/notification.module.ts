import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

import { PermissionModule } from '../permission/permission.module';

import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    forwardRef(() => UserModule),

    PermissionModule,
  ],
  providers: [NotificationService, UserService],
  controllers: [NotificationController],
  exports: [TypeOrmModule, NotificationService],
})
export class NotificationModule {}
