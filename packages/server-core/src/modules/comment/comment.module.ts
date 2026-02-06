import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PermissionModule } from '../permission/permission.module';
import { ReplyEntity } from './entities/reply.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { CommentLikeEntity } from './entities/like.entity';
import { NotificationModule } from '../notification/notification.module';
import { VideoModule } from '../video/video.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, ReplyEntity, CommentLikeEntity]),
    PermissionModule,
    UserModule,
    NotificationModule,
    VideoModule,
  ],
  providers: [CommentService, UserService],
  controllers: [CommentController],
  exports: [TypeOrmModule, CommentService],
})
export class CommentModule {}
