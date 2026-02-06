import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailEntity } from './entities/email.entity';
import { MailController } from './email.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [TypeOrmModule, MailService],
})
export class MailModule {}
