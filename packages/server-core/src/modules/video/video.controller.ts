import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  Param,
  Res,
  Inject,
  UploadedFiles,
  UploadedFile,
  Query,
  Req,
} from '@nestjs/common';

import * as path from 'path';

import { VideoService } from './video.service';
import { Response } from 'express';
import { BaseController } from 'src/base/BaseController';
import { WinstonService } from '@kazura/nestjs-winston';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { ClassificationVideoDto } from './dto/classification-video.dto';
import { VideoIdDto } from './dto/video-url.dto';
import { ClassificationsVideoDto } from './dto/classifications-video.dto';
import { ConfigService } from '@nestjs/config';
import { ClassificationsRandomVideoDto } from './dto/classifications-random.dto';
import { IsVIP } from 'src/decorators/is-vip';
import { VideoTitleDto } from './dto/video-title.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ReqUser } from 'src/decorators/req-user';
import { AddHistoryOrFavoriteVideoDto } from './dto/add-history-video.dto';
import { ServiceException } from 'src/common/ServiceException';
import { RedisService } from '@kazura/nestjs-redis';
import * as fs from 'fs';
import { EncryptResponse } from 'src/interceptors/encrypt-response-Interceptor';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { determineVideoPath } from 'src/utils';

@Controller('videos')
export class VideoController extends BaseController {
  @Inject()
  private readonly videoService!: VideoService;
  @Inject()
  private readonly userService!: UserService;
  @Inject()
  private readonly configService!: ConfigService;
  @Inject()
  private redisService!: RedisService;
  @Inject()
  private logger!: WinstonService;

  /**
   * 上传视频(可多选)
   * @param file
   * @param createVideoDto
   * @returns
   */
  // @Post('/upload')
  // @UseInterceptors(
  //   FilesInterceptor('file', 100000, {
  //     storage: diskStorage({
  //       destination: (req: any, file: any, callback: any) => {
  //         const developmentPath =
  //           '/Users/chenlifeng/skillsBank/af-Charizard/uploads/videos';

  //         // const productionPath =
  //         //   route === 'af-charizard'
  //         //     ? '/var/www/Charizard-project/uploads/videos'
  //         //     : '/var/FIRST-EBS/uploads/videos';
  //         // const productionPath = '/www/FIRST-EBS/uploads/videos';
  //         const productionPath = '/Second_EBS/uploads/videos';
  //         const uploadPath =
  //           process.env.NODE_ENV === 'development'
  //             ? developmentPath
  //             : productionPath;

  //         if (!fs.existsSync(uploadPath)) {
  //           fs.mkdirSync(uploadPath, { recursive: true });
  //         }
  //         callback(null, uploadPath);
  //       },

  //       filename: (req: any, file: any, callback: any) => {
  //         const uniqueSuffix =
  //           'FIRST-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);

  //         callback(null, `${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //     limits: {
  //       fileSize: 500000000000000 * 1024 * 1024, // 500 MB
  //     },
  //   }),
  // )
  // async uploadVideos(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() createVideoDto: CreateVideoDto,
  // ) {
  //   const data = await this.videoService.createMultiple(files, createVideoDto); // 等待异步操作完成
  //   this.logger.info('VideoService->thumbnailPath2', data);

  //   return data;
  // }

  /**
   * id获取视频
   * @param id
   * @param res
   */
  // @IsVIP()
  // @Get('/:id')
  // async getVideo(
  //   @Param('id') id: number,
  //   // @Query('user') userQuery: string,
  //   @Res() res: Response,
  // ) {
  //   // 解析用户信息
  //   // let user;
  //   // try {
  //   //   user = JSON.parse(decodeURIComponent(userQuery));
  //   // } catch (error) {
  //   //   throw new ServiceException('无效的用户信息');
  //   // }

  //   // const userInfo = await this.userService.findOneById(user?.id);
  //   // this.logger.info('锋酱的userInfo', userInfo);

  //   // if (!userInfo) {
  //   //   throw new ServiceException('用户不存在');
  //   // } else {
  //   //   const deadLine = dayjs(userInfo.vipDeadLine);
  //   //   const now = dayjs();

  //   //   const data = deadLine.isAfter(now);
  //   //   if (!data) {
  //   //     throw new ServiceException('不是会员');
  //   //   }
  //   // }

  //   const video = await this.videoService.findOne(id);
  //   this.logger.info('getVideo', video);

  //   return res.sendFile(video.path, {});
  // }

  /**
   * 获取视频地址
   * @param resource
   * @returns
   */
  @IsVIP()
  @Post('/videoUrl/vip')
  @EncryptResponse()
  async getVideoUrlVIP(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource()
    resource: AddHistoryOrFavoriteVideoDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { videoId, classification } = resource;
    const { id } = user;
    // const cacheKey = `videos:vip:${id}:${videoId}`;
    // const cachedData = await this.redisService.getClient().get(cacheKey);
    // if (cachedData) {
    //   return this.success(JSON.parse(cachedData));
    // }

    const video = await this.videoService.findOne(resource.videoId);
    const hasLiked = await this.videoService.checkUserLike(id, videoId);
    const hasFavorited = await this.videoService.checkUserFavorites(
      id,
      videoId,
    );

    // 查找下一个视频
    const nextVideo = await this.videoService.getNextVideo(
      videoId,
      classification!,
    );
    const nextVideoPath = nextVideo
      ? `${this.configService.get<string>('API_BASE_URL')}/videos/${nextVideo.id}`
      : null;

    const videoFilename = video.filename.split('.')[0]; // 构造文件名
    const nextVideoFilename = nextVideo?.filename.split('.')[0]; // 构造文件名
    this.logger.info('锋酱的videoFilename', videoFilename);

    // 列举的绝对路径
    const pathsToCheck = [
      `/Second_EBS_T/uploads/${classification}/`,
      `/Second_EBS/${classification}/`,
      `/www/uploads/${classification}/`,
    ];

    const videoPath = await determineVideoPath(pathsToCheck, videoFilename);
    const nextVideoPathM3U8 = await determineVideoPath(
      pathsToCheck,
      nextVideoFilename || '',
    );

    const data = {
      ...video,
      hasLiked,
      // data,
      hasFavorited,
      nextVideo: {
        nextVideoPath,
        ...nextVideo,
        videoPath: nextVideoPathM3U8,
      },

      videoPath,
    };

    // await this.redisService
    //   .getClient()
    //   .set(cacheKey, JSON.stringify(data), 'EX', 7 * 24 * 60 * 60); // 15min

    return this.success(data);
  }

  @Post('/videoUrl/default')
  @EncryptResponse()
  async getVideoUrlDefault(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource()
    resource: { videoId: number },
  ) {
    const cacheKey = `videos:default:${resource.videoId}`;
    const cachedData = await this.redisService.getClient().get(cacheKey);
    if (cachedData) {
      return this.success(JSON.parse(cachedData));
    }
    const video = await this.videoService.findOne(resource.videoId);

    this.logger.info('getVideo', video);

    await this.redisService
      .getClient()
      .set(cacheKey, JSON.stringify(video), 'EX', 7 * 24 * 60 * 60); // 15min

    return this.success(video);
  }

  /**
   * 通过id获取封面图(正常)
   * @param id
   * @param res
   * @returns
   */
  @Get('/thumbnailPath/:id')
  async getVideoThumbnail(@Param('id') id: number, @Res() res: Response) {
    const thumbnailPath = await this.videoService.getPicPath(
      id,
      'compressedThumbnailPath',
    );

    return res.sendFile(thumbnailPath, {});
  }
  /**
   * 通过id获取封面图(压缩)
   * @param id
   * @param res
   * @returns
   */
  @Get('/compressedThumbnailPath/:id')
  async getVideoCompressedThumbnailPath(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const compressedThumbnailPath = await this.videoService.getPicPath(
      id,
      'thumbnailPath',
    );
    return res.sendFile(compressedThumbnailPath, {});
  }

  /**
   * 获取所有视频
   * @returns
   */
  // @Get()
  // async getAllVideos(
  //   @ReqUser(true)
  //   user: UserEntity,
  // ) {
  //   const data = await this.videoService.findAll();

  //   const newData = data.map((item: any) => ({
  //     ...item,
  //     path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
  //   }));

  //   return this.success({
  //     list: newData,
  //   });
  // }

  /**
   * 根据classification查询,单classification
   * @param type
   * @returns
   */
  @Post('/classification/one')
  @EncryptResponse()
  async getVideosByOneType(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource()
    resource: ClassificationsRandomVideoDto,
  ) {
    const { classification } = resource;
    const cacheKey = `videos:classification:one:${classification}`;
    const cachedData = await this.redisService.getClient().get(cacheKey);

    if (cachedData) {
      return this.success({
        list: JSON.parse(cachedData).list,
        totalCount: JSON.parse(cachedData).totalCount,
      });
    }

    const { list, totalCount } =
      await this.videoService.getVideosByOneType(classification);
    this.logger.info('锋酱的list', list);

    const newData = list.map((item: any) => ({
      ...item,
      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));
    const data = {
      list: newData,
      totalCount,
    };

    await this.redisService
      .getClient()
      .set(cacheKey, JSON.stringify(data), 'EX', 1 * 60 * 60);

    return this.success(data);
  }
  /**
   * 根据classification查询
   * @param type
   * @returns
   */
  @Post('/classification')
  @EncryptResponse()
  async getVideosByType(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource()
    resource: ClassificationVideoDto,
  ) {
    const { classification, currentPage, pageSize, sortType, title, filename } =
      resource;

    const { list, totalCount } = await this.videoService.getVideosByType(
      currentPage,
      pageSize,
      sortType,
      classification,
      title,
      filename,
    );
    const newData = list.map((item: any) => ({
      ...item,
      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));
    const data = {
      list: newData,
      totalCount,
    };

    // await this.redisService
    //   .getClient()
    //   .set(cacheKey, JSON.stringify(data), 'EX', 7 * 24 * 60 * 60); //7天
    return this.success(data);
  }
  /**
   * 首页根据多个type查询
   * @param type
   * @returns
   */
  @Post('/more/classification')
  @EncryptResponse()
  async getVideosByMoreTypes(
    @ProtocolResource()
    resource: ClassificationsVideoDto,
  ) {
    const { classification, take } = resource;

    const cacheKey = `videos:more:classification:${take}`;
    const cachedData = await this.redisService.getClient().get(cacheKey);

    if (cachedData) {
      return this.success({
        list: JSON.parse(cachedData),
      });
    }
    // 并行调用每个分类的 getVideosByType 方法
    const resArray = await Promise.all(
      classification.map((classType) =>
        this.videoService
          .getVideosByMoreTypes(classType, take)
          .then((videos) => ({
            classification: classType,
            videos,
          })),
      ),
    );

    this.logger.info('getVideosByMoreTypes', resArray);

    const newData = resArray.map((item) => ({
      classification: item.classification,
      videos: item.videos.map((video: any) => {
        return {
          ...video,

          // posterPath: `${this.configService.get<string>('API_BASE_URL')}/videos/thumbnailPath/${video.id}`,
          path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${video.id}`,
        };
      }),
    }));

    await this.redisService
      .getClient()
      .set(cacheKey, JSON.stringify(newData), 'EX', 0.25 * 60 * 60); // 15min

    return this.success({
      list: newData,
    });
  }

  /**
   * 根据type随机查询
   * @param type
   * @returns
   */
  @Post('/random/classification')
  @EncryptResponse()
  async getVideosByTypeRandom(
    //自定义装饰器，用于验证，通过则从请求体中提取resource属性。
    @ProtocolResource()
    resource: ClassificationsRandomVideoDto,
  ) {
    const { classification, take } = resource;
    const cacheKey = `videos:random:classification:${classification}:${take}`;
    const cachedData = await this.redisService.getClient().get(cacheKey);
    if (cachedData) {
      return this.success(JSON.parse(cachedData));
    }
    const list = await this.videoService.getRandomVideosByTypeRandom(
      classification,
      take,
    );

    const newData = list.map((item: any) => ({
      ...item,
      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));
    const data = {
      list: newData,
    };

    await this.redisService
      .getClient()
      .set(cacheKey, JSON.stringify(data), 'EX', 0.5 * 60 * 60); //30min
    return this.success(data);
  }

  /**
   * 根据type随机查询
   * @param type
   * @returns
   */
  @Post('/random')
  @EncryptResponse()
  async getVideosByRandom(
    @ProtocolResource() resource: ClassificationsRandomVideoDto,
  ) {
    const { classification, take } = resource;

    const cacheKey = `videos:random:${classification}:${take}`;
    const cachedData = await this.redisService.getClient().get(cacheKey);
    if (cachedData) {
      return this.success(JSON.parse(cachedData));
    }

    const list = await this.videoService.getRandomVideosByRandom(
      classification,
      take,
    );

    const newData = list.map((item: any) => ({
      ...item,

      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));

    const data = {
      list: newData,
    };
    await this.redisService
      .getClient()
      .set(cacheKey, JSON.stringify(data), 'EX', 0.5 * 60 * 60); //30min
    return this.success(data);
  }

  /**
   * 记录播放次数
   * @param resource
   * @returns
   */
  @Post('/play')
  async incrementPlayCount(
    @ProtocolResource()
    resource: VideoIdDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const result = await this.videoService.incrementPlayCount(
      resource.id,
      user.id,
    );
    if (result === 1) {
      throw new ServiceException('今日已经观看过该视频');
    }
    return this.success();
  }

  /**
   * title模糊搜索
   * @param resource
   * @returns
   */
  @Post('/search/title')
  @EncryptResponse()
  async searchByTitle(
    @ProtocolResource()
    resource: VideoTitleDto,
  ) {
    const { title, currentPage, pageSize } = resource;
    const { list, totalCount } = await this.videoService.findByTitle(
      title,
      currentPage,
      pageSize,
    );
    const newList = list.map((item: any) => ({
      ...item,
      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));
    return this.success({
      list: newList,
      totalCount,
    });
  }

  /**
   * 查询历史记录
   * @returns
   */
  @Post('/history/search')
  // @EncryptResponse()
  async searchHistory(
    @ProtocolResource()
    resource: { title: string },
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { title } = resource;
    const { id } = user;
    const list = await this.videoService.findHistoryByUserId(
      id,

      title,
    );
    const newList = list.map((item: any) => ({
      ...item,

      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));

    return this.success(newList);
  }

  /**
   * 添加历史记录
   * @param resource
   * @returns
   */
  @Post('/history/add')
  async addVideoToHistory(
    @ProtocolResource()
    resource: AddHistoryOrFavoriteVideoDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { videoId } = resource;
    const { id } = user;

    await this.videoService.addVideoToHistory(id, videoId);
    return this.success();
  }
  /**
   * 删除历史记录
   * @param resource
   * @returns
   */
  @Post('/history/clear')
  async clearHistory(
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { id } = user;
    await this.videoService.clearHistoryByUserId(id);
    return this.success({ message: '历史记录已清空' });
  }
  /**
   * 删除收藏记录
   * @param resource
   * @returns
   */
  @Post('/favorite/clear')
  async clearFavorite(
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { id } = user;
    await this.videoService.clearFavoriteByUserId(id);
    return this.success({ message: '收藏记录已清空' });
  }

  /**
   * 查询收藏记录
   * @returns
   */

  @Post('/favorite/search')
  @EncryptResponse()
  async searchFavorits(
    @ProtocolResource()
    resource: { classification: string },
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { classification } = resource;
    const { id } = user;
    const list = await this.videoService.findFavoriteByUserId(
      id,
      classification,
    );
    const newList = list.map((item: any) => ({
      ...item,

      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));
    return this.success(newList);
  }

  /**
   * 用户的收藏列表分类
   * @param user
   * @returns
   */
  @Post('/favorite/classifications')
  @EncryptResponse()
  async favoriteClassifications(
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { id } = user;
    const classifications = await this.videoService.favoriteClassifications(id);

    return this.success(classifications);
  }

  /**
   * 添加收藏
   * @param userId
   * @param videoId
   * @returns
   */
  @Post('/favorite/add')
  async addVideoToFavorites(
    @ProtocolResource()
    resource: AddHistoryOrFavoriteVideoDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { videoId } = resource;
    const { id } = user;

    const result = await this.videoService.addVideoToFavorites(id, videoId);
    if (!result) {
      throw new ServiceException('视频不存在或已经在收藏列表');
    }
    return this.success();
  }

  /**
   * 取消收藏
   * @param userId
   * @param videoId
   * @returns
   */
  @Post('/favorite/remove')
  async removeVideoFromFavorites(
    @ProtocolResource()
    resource: AddHistoryOrFavoriteVideoDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { videoId } = resource;
    const { id } = user;

    const result = await this.videoService.removeVideoFromFavorites(
      id,
      videoId,
    );
    if (!result) {
      throw new ServiceException('视频不存在或不在收藏列表');
    }
    return this.success();
  }

  /**
   * 点赞
   * @param resource
   * @returns
   */
  @Post('/like/add')
  async likeVideo(
    @ProtocolResource()
    resource: AddHistoryOrFavoriteVideoDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { videoId } = resource;
    const { id } = user;

    const result = await this.videoService.likeVideo(id, videoId);

    if (!result) {
      throw new ServiceException('你已经点过赞了，不能重复点赞');
    }
    return this.success();
  }
  /**
   * 取消点赞
   * @param resource
   * @returns
   */
  @Post('/like/remove')
  async unlikeVideo(
    @ProtocolResource()
    resource: AddHistoryOrFavoriteVideoDto,
    @ReqUser(true)
    user: UserEntity,
  ) {
    const { videoId } = resource;
    const { id } = user;

    const result = await this.videoService.unlikeVideo(id, videoId);

    if (!result) {
      throw new ServiceException('未赞过的视频不能取消点赞');
    }
    return this.success();
  }

  /**
   * 首页最新视频及点赞+收藏最多
   * @param resource
   * @returns
   */
  @Post('/home')
  @EncryptResponse()
  async getHomeVideos() {
    const cacheKey = `videos:home`;
    const cachedData = await this.redisService.getClient().get(cacheKey);

    if (cachedData) {
      this.logger.info(`Cache hit for key:`, cacheKey);

      return this.success(JSON.parse(cachedData));
    }

    const result = await this.videoService.getHomeVideos();

    await this.redisService
      .getClient()
      .set(cacheKey, JSON.stringify(result), 'EX', 0.25 * 60 * 60); // 15min

    return this.success(result);
  }

  @Get('/m3u8')
  async getM3U8(
    @Query('pathName') pathName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // this.logger.info('锋酱的req', req);
    // const xForwardedFor = req.headers['x-forwarded-for'];
    // const clientIp = Array.isArray(xForwardedFor)
    //   ? xForwardedFor[0]
    //   : xForwardedFor;
    // const finalIp =
    //   typeof clientIp === 'string' ? clientIp : req.connection.remoteAddress;
    // this.logger.info('锋酱的', finalIp);
    // console.log('%c这是锋酱的打印', 'color: red; font-size: 30px;', finalIp);
    // // 在数据库中查找与IP地址匹配的用户
    // const users = await this.userService.findByIP(finalIp || '');
    // if (!users || users.length === 0) {
    //   throw new ServiceException('IP未被记录');
    //   // 如果没有任何用户与此IP匹配，停止请求
    // }
    // // 检查是否有任何用户是VIP
    // const hasValidVIP = users.some((user) => user.isVIP());
    // const hasBan = users.some((user) => user.isBan());
    // if (!hasValidVIP) {
    //   throw new ServiceException('会员已过期');
    //   // 如果没有任何用户是VIP，停止请求
    // }
    // if (hasBan) {
    //   throw new ServiceException('您已被封号');
    // }
    // if (!pathName) {
    //   return res.status(400).send('Path name is required');
    // }
    // const filePath = path.resolve(pathName);
    // if (!fs.existsSync(filePath)) {
    //   return res.status(404).send('File not found');
    // }
    // let m3u8Content = fs.readFileSync(filePath, 'utf-8');
    // const baseDir = path.dirname(filePath); // Get the directory of the m3u8 file
    // const modifiedContent = m3u8Content.replace(/(video_\d+\.ts)/g, (match) => {
    //   const tsFilePath = path.join(baseDir, match);
    //   return `${this.configService.get<string>('API_BASE_URL')}/videos/ts?pathName=${encodeURIComponent(tsFilePath)}`;
    // });
    // res.setHeader('Content-Type', 'application/x-mpegURL');
    // res.send(modifiedContent);
  }

  @Get('/ts')
  getTsFile(@Query('pathName') pathName: string, @Res() res: Response) {
    // if (!pathName) {
    //   return res.status(400).send('Path name is required');
    // }
    // const filePath = path.resolve(pathName);
    // if (!fs.existsSync(filePath)) {
    //   return res.status(404).send('File not found');
    // }
    // const stat = fs.statSync(filePath);
    // res.setHeader('Content-Type', 'video/mp2t');
    // res.setHeader('Content-Length', stat.size);
    // const readStream = fs.createReadStream(filePath);
    // readStream.pipe(res);
  }
}
