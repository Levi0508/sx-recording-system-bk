import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoEntity } from './entities/video.entity';
import { HistoryEntity } from './entities/history.entity';
import { FavoriteEntity } from './entities/favorite.entity';

import { LikeEntity } from './entities/like.entity';
import { UserModule } from '../user/user.module';
import { PassportModule } from '../passport/passport.module';
import { PassportService } from '../passport/passport.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoEntity,
      HistoryEntity,
      FavoriteEntity,
      LikeEntity,
    ]),
    UserModule,
    PassportModule,
  ],
  controllers: [VideoController],
  providers: [TypeOrmModule, VideoService, PassportService],
  exports: [TypeOrmModule, VideoService],
})
export class VideoModule {}
