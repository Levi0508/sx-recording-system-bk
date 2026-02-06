import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignInEntity } from './entities/sign-in.entity';

import { SignInService } from './sign-in.service';
import { SignInController } from './sign-in.controller';
import { SignInStatsEntity } from './entities/sign-in-stats.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { SignInGetGiftEntity } from './entities/sign-in.get-gift';
import { SignInHandleEntity } from './entities/sign-in-handle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SignInEntity,
      SignInStatsEntity,
      UserEntity,
      SignInGetGiftEntity,
      SignInHandleEntity,
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [SignInService],
  controllers: [SignInController],
  exports: [TypeOrmModule, SignInService],
})
export class SignInModule {}
