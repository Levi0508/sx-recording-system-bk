import { Inject, Injectable } from '@nestjs/common';
import { CommentEntity } from './entities/comment.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@kazura/nestjs-redis';
import { WinstonService } from '@kazura/nestjs-winston';
import { UserEntity } from '../user/entities/user.entity';
import { ServiceException } from 'src/common/ServiceException';
import { ReplyEntity } from './entities/reply.entity';
import { UserService } from '../user/user.service';
import { CommentLikeEntity } from './entities/like.entity';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { NotificationService } from '../notification/notification.service';
import { VideoService } from '../video/video.service';
import { truncateText } from 'src/utils/truncate-text';

@Injectable()
export class CommentService {
  @InjectRepository(CommentEntity)
  private commentRepository!: Repository<CommentEntity>;
  @InjectRepository(ReplyEntity)
  private replyRepository!: Repository<ReplyEntity>;
  @InjectRepository(CommentLikeEntity)
  private commentLikeRepository!: Repository<CommentLikeEntity>;

  @Inject()
  private userService!: UserService;
  @Inject()
  private videoService!: VideoService;
  @Inject()
  private redisService!: RedisService;
  @Inject()
  private notificationService!: NotificationService;
  @Inject()
  private reflector!: Reflector;
  @Inject()
  private readonly configService!: ConfigService;
  @Inject()
  private logger!: WinstonService;

  /**
   * 校验评论是否存在
   * @param commentId
   */
  private async verifyCommentHave(commentId: number, isReply: number) {
    let comment;
    //一级
    if (isReply === 0) {
      comment = await this.commentRepository.findOneBy({ id: commentId });
    } else if (isReply === 1) {
      comment = await this.replyRepository.findOneBy({ id: commentId });
    }
    if (!comment) {
      throw new ServiceException('该评论不存在');
    }

    return comment;
  }
  /**
   * 新增评论
   * @param user
   * @param content
   * @param videoId
   * @param replyCommentId
   * @returns
   */
  async create(user: UserEntity, content: string, videoId: number) {
    const comment = new CommentEntity();
    comment.content = content;
    comment.videoId = videoId;
    comment.userId = user.id;

    return await this.commentRepository.save(comment);
  }

  /**
   * 删除评论
   * @param user
   * @param commentId
   */

  async delete(user: UserEntity, commentId: number, isReply: number) {
    //校验评论是否存在
    const comment = await this.verifyCommentHave(commentId, isReply);
    if (comment) {
      // 判断评论是否属于当前用户
      if (comment.userId !== user.id) {
        if (user.email !== '1326029085@qq.com') {
          throw new ServiceException('不能删除别人的评论');
        }
      }
      if (isReply === 0) {
        // 删除一级评论及其所有回复
        await this.commentRepository.delete(commentId);
        await this.replyRepository.delete({ commentId });
      }

      isReply === 1 && (await this.replyRepository.delete(commentId));
    }
  }

  /**
   * 查询评论
   * @param videoId
   * @returns
   */

  async findCommentByVideoId(
    user: UserEntity,
    videoId: number,
    currentPage: number,
    pageSize: number,
  ) {
    const offset = (currentPage - 1) * pageSize;

    const query = `
    SELECT
      c.id AS comment_id,
      c.content AS comment_content,
      c.video_id AS comment_videoId,
      c.user_id AS comment_userId,
      c.like_num AS comment_likeNum,
      c.is_top AS comment_isTop,
      c.created_at AS comment_createdAt,
      u.*,
      CASE WHEN cl.comment_id IS NOT NULL THEN 1 ELSE 0 END AS hasLiked
    FROM clf_comment c
    LEFT JOIN clf_user u ON c.user_id = u.id
    LEFT JOIN clf_comment_like cl ON c.id = cl.comment_id AND cl.user_id = ?
    WHERE c.video_id = ?
    ORDER BY c.is_top DESC, c.created_at DESC
    LIMIT ${offset}, ${pageSize}
  `;

    const countQuery = `
      SELECT COUNT(c.id) AS total_count
      FROM clf_comment c
      WHERE c.video_id = ?
    `;

    const comments = await this.commentRepository.query(query, [
      user.id,
      videoId,
    ]);
    this.logger.info('comments', comments);

    const [{ total_count }] = await this.commentRepository.query(countQuery, [
      videoId,
    ]);

    const commentIds = comments.map((comment: any) => comment.comment_id);
    this.logger.info('commentscomments', comments);
    if (comments.length > 0) {
      const replies = await this.replyRepository
        .createQueryBuilder('reply')
        .leftJoinAndSelect(
          UserEntity,
          'replyUser',
          'reply.user_id = replyUser.id',
        )
        .leftJoinAndSelect(
          UserEntity,
          'replyIsReplyUser',
          'reply.reply_is_reply_user_id = replyIsReplyUser.id',
        )
        .leftJoinAndSelect(
          CommentLikeEntity,
          'commentLike',
          'reply.id = commentLike.comment_id',
        )
        .where('reply.comment_id IN (:...commentIds)', { commentIds })
        .orderBy('reply.created_at', 'ASC')
        // .addSelect('IF(commentLike.comment_id IS NOT NULL, 1, 0)', 'hasLiked')
        .getRawMany();

      this.logger.info('kk', replies);

      const formattedComments = comments.map((comment: any) => {
        this.logger.info('锋酱的comment', comment);

        return {
          id: comment.comment_id,
          content: comment.comment_content,
          likeNum: comment.comment_likeNum,
          isTop: comment.comment_isTop,
          isReply: 0, //是一级回复
          createdAt: comment.comment_createdAt,
          user: {
            id: comment.id,
            avatar: comment.avatar
              ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${comment.id}`
              : null,
            nickname: comment.nick_name,
            vipDeadLine: comment.vip_dead_line,
            vipType: comment.vip_type,
            avatarFrame: comment.avatar_frame,
            // email: comment.email,
          },
          videoId: comment.comment_videoId,
          hasLiked: comment.hasLiked === 1,
          replies: {
            count: replies.filter(
              (reply) => reply.reply_comment_id === comment.comment_id,
            ).length,
            list: replies
              .filter((reply) => reply.reply_comment_id === comment.comment_id)
              .map((reply) => {
                return {
                  id: reply.reply_id,
                  content: reply.reply_content,
                  likeNum: reply.reply_like_num,
                  createdAt: reply.reply_created_at,
                  isReply: 1, //是二级回复
                  user: {
                    id: reply.replyUser_id,
                    avatar: reply.replyUser_avatar
                      ? `${this.configService.get<string>('API_BASE_URL')}/user/avatar/${reply.replyUser_id}`
                      : null,
                    nickname: reply.replyUser_nick_name,
                    vipDeadLine: reply.replyUser_vip_dead_line,
                    vipType: reply.replyUser_vip_type,
                    avatarFrame: reply.replyUser_avatar_frame,
                  },
                  replyIsReply: reply.reply_reply_is_reply, //0说明回复的是一级评论，1则是二级，需要@
                  replyUser: {
                    id: reply.reply_reply_is_reply_user_id,

                    nickname: reply.replyIsReplyUser_nick_name,
                  },

                  hasLiked:
                    reply.reply_id === reply.commentLike_comment_id &&
                    reply.commentLike_is_reply === 1 &&
                    reply.commentLike_user_id === user.id,
                };
              }),
          },
        };
      });

      return { list: formattedComments, totalCount: total_count };
    } else {
      return { list: [], totalCount: 0 };
    }
  }

  /**
   * 创建评论回复 isReply 0一级/1二级
   * @param createReplyDto
   */
  async replyComment(
    user: UserEntity,
    content: string,
    commentId: number,
    isReply: number,
  ) {
    const comment = await this.verifyCommentHave(commentId, isReply);
    this.logger.info('锋酱的commentcomment', comment);

    if (!comment) {
      throw new ServiceException('该评论不存在');
    }

    const userReply = await this.userService.findOneById(comment.userId);

    this.logger.info('锋酱的userReply', userReply);

    if (!userReply) {
      throw new ServiceException('该用户不存在');
    }
    const video = await this.videoService.findOne(comment.videoId);
    if (!video) {
      throw new ServiceException('该视频不存在');
    }

    const reply = new ReplyEntity();
    reply.content = content;
    // reply.content = `回复 @${userReply.nickname || '默认昵称'}：${content}`;
    reply.commentId =
      isReply === 0 ? comment.id : (comment as ReplyEntity).commentId;
    reply.videoId = comment.videoId;
    reply.userId = user.id; //回复人
    reply.likeNum = 0;
    reply.replyUserId = comment.userId;
    reply.replyIsReply = isReply;
    reply.replyIsReplyUserId = isReply === 0 ? undefined : comment.userId;
    await this.replyRepository.save(reply);

    if (reply.replyUserId !== user.id) {
      // 发送消息通知
      await this.notificationService.createNotification(
        reply.replyUserId, //收件人
        user.id, //发件人
        `来自视频《${truncateText(video.title, 8)} 》的回复`,
        `回复评论《${truncateText(comment.content)}》：${content}`,
        'video',
        comment.videoId,
        video.classification,
      );
    }
  }

  /**
   * 评论点赞
   * @param user
   * @param commentId
   * @param videoId
   * @param isReply
   */
  async likeAddComment(
    user: UserEntity,
    commentId: number,
    videoId: number,
    isReply: number,
  ) {
    const comment = await this.verifyCommentHave(commentId, isReply);

    if (comment) {
      const existingLike = await this.commentLikeRepository.findOneBy({
        commentId,
        userId: user.id,
        videoId,
        isReply,
      });

      if (existingLike) {
        throw new ServiceException('用户已点赞该评论');
      }

      const commentLike = new CommentLikeEntity();
      commentLike.commentId = commentId;
      commentLike.userId = user.id;
      commentLike.videoId = videoId;
      commentLike.isReply = isReply;
      await this.commentLikeRepository.insert(commentLike);

      comment.likeNum += 1;

      isReply === 0 &&
        (await this.commentRepository.update(
          { id: comment.id },
          {
            likeNum: comment!.likeNum,
          },
        ));
      isReply === 1 &&
        (await this.replyRepository.update(
          { id: comment.id },
          {
            likeNum: comment!.likeNum,
          },
        ));
    }
  }
  /**
   * 评论点赞
   * @param user
   * @param commentId
   * @param videoId
   * @param isReply
   */
  async likeRemoveComment(
    user: UserEntity,
    commentId: number,
    videoId: number,
    isReply: number,
  ) {
    const comment = await this.verifyCommentHave(commentId, isReply);

    //校验评论是否存在
    if (comment) {
      const existingLike = await this.commentLikeRepository.findOneBy({
        commentId,
        userId: user.id,
        videoId,
      });

      if (!existingLike) {
        throw new ServiceException('用户未点赞该评论');
      }

      await this.commentLikeRepository.remove(existingLike);

      comment.likeNum -= 1;
      isReply === 0 &&
        (await this.commentRepository.update(
          { id: comment.id },
          {
            likeNum: comment.likeNum,
          },
        ));
      isReply === 1 &&
        (await this.replyRepository.update(
          { id: comment.id },
          {
            likeNum: comment.likeNum,
          },
        ));
    }
  }

  /**
   * 置顶
   * @param commentId
   */
  async topAddComment(user: UserEntity, commentId: number) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new ServiceException('该评论不存在');
    }
    if (comment.isTop) {
      throw new ServiceException('该评论已经置顶');
    }
    // 取消已经置顶的评论
    await this.commentRepository
      .createQueryBuilder()
      .update(CommentEntity)
      .set({ isTop: false })
      .where('isTop = :isTop', { isTop: true })
      .execute();

    comment.isTop = true;
    await this.commentRepository.update(
      { id: comment.id },
      {
        isTop: comment.isTop,
      },
    );
  }
  /**
   * 取消置顶
   * @param commentId
   */
  async topRemoveComment(user: UserEntity, commentId: number) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new ServiceException('该评论不存在');
    }
    if (!comment.isTop) {
      throw new ServiceException('该评论未置顶');
    }

    comment.isTop = false;
    await this.commentRepository.update(
      { id: comment.id },
      {
        isTop: comment.isTop,
      },
    );
  }
}
