import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportEntity } from './entities/passport.entity';
import { PassportService } from './passport.service';
import { PassportController } from './passport.controller';
import { PermissionModule } from '../permission/permission.module';
import { VisitCountEntity } from './entities/visit-count.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PassportEntity, VisitCountEntity]),
    forwardRef(() => UserModule),
    PermissionModule,
  ],
  providers: [PassportService],
  controllers: [PassportController],
  exports: [TypeOrmModule, PassportService],
})
export class PassportModule {}
