import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceptionSessionEntity } from './entities/reception-session.entity';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './reception.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReceptionSessionEntity]),
  ],
  controllers: [ReceptionController],
  providers: [ReceptionService],
  exports: [ReceptionService],
})
export class ReceptionModule {}
