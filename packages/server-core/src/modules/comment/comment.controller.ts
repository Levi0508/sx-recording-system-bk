import { Controller, Inject, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

import { ProtocolResource } from 'src/decorators/protocol-resource';
import { PermissionService } from '../permission/permission.service';
import { WinstonService } from '@kazura/nestjs-winston';
import { BaseController } from 'src/base/BaseController';
import { ReqUser } from 'src/decorators/req-user';
import { UserEntity } from '../user/entities/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DeleteCommentDto } from './dtos/delete-comment.dto';
import { FindCommentDto } from './dtos/find-comment.dto';
import { ReplyCommentDto } from './dtos/reply-comment.dto';
import { LikeCommentDto } from './dtos/like-comment.dto';
import { TopCommentDto } from './dtos/top-comment.dto';
import { EncryptResponse } from 'src/interceptors/encrypt-response-Interceptor';

@Controller('/comment')
export class CommentController extends BaseController {
  @Inject()
  private readonly commentService!: CommentService;
  @Inject()
  private readonly permissionService!: PermissionService;
  @Inject()
  private readonly logger!: WinstonService;

  /**
   * 新增评论
   * @param resource
   * @param user
   * @returns
   */
  @Post('/create')
  async create(
    @ProtocolResource() resource: CreateCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { content, videoId } = resource;
    await this.commentService.create(user, content, videoId);
    return this.success();
  }
  /**
   * 删除评论
   * @param resource
   * @param user
   * @returns
   */
  @Post('/delete')
  async delete(
    @ProtocolResource() resource: DeleteCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { commentId, isReply } = resource;
    await this.commentService.delete(user, commentId, isReply);
    return this.success();
  }

  /**
   * 查询评论
   * @param resource
   * @returns
   */
  @Post('/find/videoId')
  @EncryptResponse()
  async findCommentByVideoId(
    @ProtocolResource() resource: FindCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { videoId, currentPage, pageSize } = resource;
    this.logger.info('find/videoId', user);
    if (user) {
      const result = await this.commentService.findCommentByVideoId(
        user,
        videoId,
        currentPage!,
        pageSize!,
      );
      return this.success(result);
    } else {
      return this.success({ list: [], totalCount: 0 });
    }
  }

  /**
   * 回复一级评论
   * @param resource
   * @returns
   */
  @Post('/reply')
  async replyComment(
    @ProtocolResource() resource: ReplyCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { content, commentId, isReply } = resource;
    await this.commentService.replyComment(user, content, commentId, isReply);
    return this.success();
  }

  /**
   * 点赞评论
   * @param resource
   * @param user
   * @returns
   */
  @Post('/like/add')
  async likeComment(
    @ProtocolResource() resource: LikeCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { commentId, videoId, isReply } = resource;
    await this.commentService.likeAddComment(user, commentId, videoId, isReply);
    return this.success();
  }

  /**
   * 取消点赞
   * @param replyId
   * @param userId
   * @returns
   */
  @Post('like/remove')
  async likeRemove(
    @ProtocolResource() resource: LikeCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { commentId, videoId, isReply } = resource;

    await this.commentService.likeRemoveComment(
      user,
      commentId,
      videoId,
      isReply,
    );
    return this.success();
  }

  /**
   * 置顶
   * @param resource
   * @param user
   * @returns
   */
  @Post('/top/add')
  async topAdd(
    @ProtocolResource() resource: TopCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    await this.commentService.topAddComment(user, resource.commentId);
    return this.success();
  }
  /**
   * 取消置顶
   * @param resource
   * @param user
   * @returns
   */
  @Post('/top/remove')
  async topRemove(
    @ProtocolResource() resource: TopCommentDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    await this.commentService.topRemoveComment(user, resource.commentId);
    return this.success();
  }
}
