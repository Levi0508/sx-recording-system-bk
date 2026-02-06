import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VideoEntity } from './entities/video.entity';
import { WinstonService } from '@kazura/nestjs-winston';
import { FILTER_ENUM, VIDEO_TYPE_ENUM } from 'src/enum';
import { ConfigService } from '@nestjs/config';

import { RedisService } from '@kazura/nestjs-redis';
import * as dayjs from 'dayjs';
import { HistoryEntity } from './entities/history.entity';
import { FavoriteEntity } from './entities/favorite.entity';
import { LikeEntity } from './entities/like.entity';

import { PassportService } from '../passport/passport.service';

@Injectable()
export class VideoService {
  @InjectRepository(VideoEntity)
  private videoRepository!: Repository<VideoEntity>;

  @InjectRepository(HistoryEntity)
  private historyRepository!: Repository<HistoryEntity>;
  @InjectRepository(LikeEntity)
  private likeRepository!: Repository<LikeEntity>;
  @InjectRepository(FavoriteEntity)
  private favoriteRepository!: Repository<FavoriteEntity>;
  @Inject()
  private readonly passportService!: PassportService;
  @Inject()
  private readonly configService!: ConfigService;
  @Inject()
  private redisService!: RedisService;
  @Inject()
  private logger!: WinstonService;

  /**
   * 上传视频
   * @param files
   * @param createVideoDto
   * @returns
   */
  // async createMultiple(
  //   files: Express.Multer.File[],
  //   createVideoDto: CreateVideoDto,
  // ) {
  //   const { classification } = createVideoDto;

  //   const videoEntities: VideoEntity[] = [];

  //   for (const file of files) {
  //     const { size, duration } = await this.getVideoMetadata(file.path);
  //     const path = await this.generateThumbnail(file.path);
  //     const decodedName = Buffer.from(file.originalname, 'binary')
  //       .toString('utf-8')
  //       .split('.')[0];
  //     const videoEntity = this.videoRepository.create({
  //       // title: file.originalname.split('.')[0],
  //       title: decodedName,
  //       filename: file.filename,
  //       path: file.path,
  //       classification,
  //       // thumbnailPath: path.split('****')[0],
  //       // compressedThumbnailPath: path.split('****')[1],

  //       thumbnailPath: '',
  //       compressedThumbnailPath: path,

  //       size,
  //       duration,
  //     });
  //     videoEntities.push(videoEntity);
  //   }

  //   return await this.videoRepository.save(videoEntities);
  // }
  // async getVideoMetadata(
  //   filePath: string,
  // ): Promise<{ size: number; duration: number }> {
  //   return new Promise((resolve, reject) => {
  //     ffmpeg.ffprobe(filePath, (err, metadata) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       const size = metadata.format.size;
  //       const duration = metadata.format.duration;
  //       resolve({ size: size!, duration: duration! });
  //     });
  //   });
  // }
  // /**
  //  * 处理视频封面+压缩
  //  * @param videoPath
  //  * @returns
  //  */
  // private async generateThumbnail(videoPath: string): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     // const bgImgDir = this.configService.get<string>('BGIMG_PATH')!;
  //     const compressImgDir =
  //       this.configService.get<string>('COMPRESSIMG_PATH')!;

  //     // 确保目录存在
  //     // if (!fs.existsSync(bgImgDir)) {
  //     //   fs.mkdirSync(bgImgDir, { recursive: true });
  //     // }
  //     if (!fs.existsSync(compressImgDir)) {
  //       fs.mkdirSync(compressImgDir, { recursive: true });
  //     }
  //     // const thumbnailFilename = `FIRST-thumbnail-${Date.now()}.png`;
  //     // const thumbnailPath = path.join(bgImgDir, thumbnailFilename);
  //     // ffmpeg(videoPath)
  //     //   // .seekInput(10) // 截取视频第10秒
  //     //   .screenshots({
  //     //     timestamps: ['20%'], // 截取视频的20%位置的缩略图
  //     //     filename: thumbnailFilename,
  //     //     // folder: bgImgDir,
  //     //   })
  //     //   .on('end', async () => {
  //     //     try {
  //     //       const compressedThumbnailFilename = `FIRST-compressed-${Date.now()}.jpg`;
  //     //       const compressedThumbnailPath = path.join(
  //     //         compressImgDir,
  //     //         compressedThumbnailFilename,
  //     //       );

  //     //       await sharp(thumbnailPath)
  //     //         .resize({ width: 800 }) // 根据需要调整大小
  //     //         .jpeg({ quality: 50 })
  //     //         .toFile(compressedThumbnailPath);

  //     //       console.log(
  //     //         `Compressed thumbnail saved at: ${compressedThumbnailPath}`,
  //     //       );

  //     //       resolve(`${thumbnailPath}****${compressedThumbnailPath}`);
  //     //     } catch (err) {
  //     //       console.error('Error during image compression:', err);
  //     //       reject(err);
  //     //     }
  //     //   })
  //     //   .on('error', (err: any) => {
  //     //     reject(err);
  //     //   });
  //     const compressedThumbnailFilename = `FIRST-compressed-${Date.now()}.jpg`;
  //     const compressedThumbnailPath = path.join(
  //       compressImgDir,
  //       compressedThumbnailFilename,
  //     );
  //     ffmpeg(videoPath)
  //       .screenshots({
  //         timestamps: ['20%'], // 截取视频的20%位置的缩略图
  //         filename: compressedThumbnailFilename,
  //         folder: compressImgDir,
  //       })
  //       .outputOptions('-q:v 2')
  //       .on('end', () => {
  //         console.log(
  //           `Compressed thumbnail saved at: ${compressedThumbnailPath}`,
  //         );
  //         resolve(compressedThumbnailPath);
  //       })
  //       .on('error', (err: any) => {
  //         reject(err);
  //       });
  //   });
  // }

  /**
   * 单个查询
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<any> {
    const data = this.videoRepository.findOneBy({ id });
    this.logger.info('VideoService->findOne', data);
    return data;
  }

  /**
   * 查询所有
   * @returns
   */
  async findAll(): Promise<any> {
    return this.videoRepository.find();
  }

  /**
   * 根据classification查询,单个
   * @param classification
   * @returns
   */
  async getVideosByOneType(
    classification: VIDEO_TYPE_ENUM,
  ): Promise<{ list: VideoEntity[]; totalCount: number }> {
    const queryOptions: any = {
      order: { createdAt: 'DESC' }, // 按时间倒序排序
      where: { status: 0, classification },
    };

    // 查询总记录数
    const totalCount = await this.videoRepository.count({
      where: queryOptions.where,
    });
    // 查询数据
    const list = await this.videoRepository.find(queryOptions);

    return { list, totalCount };
  }
  /**
   * 根据classification查询
   * @param classification
   * @returns
   */
  async getVideosByType(
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 60, // 默认每页显示10条记录
    sortType: FILTER_ENUM = FILTER_ENUM.NEW, // 默认按更新时间排序
    classification?: VIDEO_TYPE_ENUM,
    title?: string,
    filename?: string,
  ): Promise<{ list: VideoEntity[]; totalCount: number }> {
    let order = {};
    switch (sortType) {
      case FILTER_ENUM.PLAYTIMES:
        order = { playTimes: 'DESC' };
        break;
      case FILTER_ENUM.LIKES:
        order = { likes: 'DESC' };
        break;
      case FILTER_ENUM.FAVORITES:
        order = { favorites: 'DESC' };
        break;
      case FILTER_ENUM.NEW:
      default:
        order = { createdAt: 'DESC' };
        break;
    }

    const queryOptions: any = {
      order, // 根据filter设置排序
      where: { status: 0 },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    };
    if (classification) {
      queryOptions.where = {
        ...queryOptions.where,
        classification,
      };
    }
    if (title) {
      queryOptions.where = {
        ...queryOptions.where,
        title: Like(`%${title}%`),
      };
    }
    if (filename) {
      queryOptions.where = {
        ...queryOptions.where,
        filename: Like(`%${filename}%`),
      };
    }
    // 查询总记录数
    const totalCount = await this.videoRepository.count({
      where: queryOptions.where,
    });
    // 查询数据
    const list = await this.videoRepository.find(queryOptions);

    return { list, totalCount };
  }

  /**
   * 根据多个type查询
   * @param classification
   * @param take
   * @returns
   */
  async getVideosByMoreTypes(classification: VIDEO_TYPE_ENUM, take?: number) {
    const queryOptions: any = {
      where: { classification, status: 0 },
      order: { createdAt: 'DESC' }, // 按时间倒序排序
      ...(take && { take }),
    };

    const videos = await this.videoRepository.find(queryOptions);

    return videos;
  }

  /**
   * 根据type查询随机10条数据
   * @param classification
   * @param take
   * @returns
   */
  async getRandomVideosByTypeRandom(
    classification: VIDEO_TYPE_ENUM,
    take: number = 10, // 默认获取 10 条记录
  ): Promise<VideoEntity[]> {
    const queryOptions: any = {
      where: { classification, status: 0 },
      // order: { createdAt: 'DESC' },
    };

    // 获取所有符合条件的记录
    const allVideos = await this.videoRepository.find(queryOptions);

    // 随机选择 10 条记录
    const randomVideos = allVideos
      .sort(() => 0.5 - Math.random())
      .slice(0, take);

    return randomVideos;
  }

  /**
   * 查询随机12条数据
   * @param classification
   * @param take
   * @returns
   */
  async getRandomVideosByRandom(
    classification: VIDEO_TYPE_ENUM,
    take: number = 12, // 默认获取 12 条记录
  ) {
    // 获取总记录数
    // 步骤1：从 VIDEO_TYPE_ENUM 中排除指定的类型
    const allTypes = Object.values(VIDEO_TYPE_ENUM);
    const availableTypes = allTypes.filter((type) => type !== classification);

    // 步骤2：如果没有其他类型可用，返回空数组
    if (availableTypes.length === 0) {
      return [];
    }
    // 步骤3：随机选择一个剩余的枚举类型
    const randomType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];
    this.logger.info('锋酱的randomType', randomType);

    // 步骤4：基于选择的类型查询数据
    const randomVideos = await this.videoRepository
      .createQueryBuilder('video_upload')
      .where('video_upload.classification = :randomType', { randomType })
      .andWhere('video_upload.status = 0')
      .take(take) // 限制返回的记录数
      .getMany();

    return randomVideos;
  }
  /**
   * 获取截图路径
   * @param id
   * @param type
   * @returns
   */
  async getPicPath(id: number, type: string): Promise<string> {
    const video = await this.findOne(id);
    if (!video || !video[type]) {
      throw new NotFoundException('Video or thumbnail not found');
    }

    return video[type];
  }

  /**
   * 播放次数+1
   * @param id
   */

  async incrementPlayCount(id: number, uid: number) {
    const key = `playTimes:${uid}:${id}:${dayjs().format('YYYY-MM-DD')}`;
    const data = await this.redisService.getClient().setnx(key, 'true');
    // await this.passportService._incrementTotalPlayCount();

    if (data === 1) {
      await this.redisService.getClient().expire(key, 60 * 60); // 缓存1小时
      await this._incrementPlayCount(id);
    } else {
      return 1; // 表示当天已经播放过该视频
    }
  }
  private async _incrementPlayCount(id: number) {
    await this.videoRepository
      .createQueryBuilder()
      .update(VideoEntity)
      .set({ playTimes: () => `playTimes + 1` })
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 根据title模糊搜索
   * @param title
   * @returns
   */
  async findByTitle(
    title: string,
    currentPage: number = 1, // 默认页码为1
    pageSize: number = 60,
  ): Promise<{ list: VideoEntity[]; totalCount: number }> {
    // 查询总记录数
    const totalCount = await this.videoRepository.count({
      where: { title: Like(`%${title}%`) },
    });

    // 查询数据
    const list = await this.videoRepository
      .createQueryBuilder('video_upload')
      .where('video_upload.title LIKE :title', { title: `%${title}%` })
      .andWhere('video_upload.status = 0')

      .orderBy('video_upload.createdAt', 'DESC') // 按时间倒序排序
      .skip((currentPage - 1) * pageSize) // 跳过的记录条数
      .take(pageSize) // 返回的记录条数
      .getMany();

    return { list, totalCount };
  }
  /**
   * 查询历史记录
   * @param uid
   * @returns
   */
  async findHistoryByUserId(
    uid: number,
    // currentPage: number = 1, // 默认页码为1
    // pageSize: number = 60,
    title?: string | undefined,
  ) {
    const queryBuilder = this.historyRepository
      .createQueryBuilder('video_history')
      .leftJoinAndSelect(
        VideoEntity,
        'video',
        'video_history.videoId = video.id',
      )
      .where('video_history.userId = :uid', { uid })
      .andWhere('video.status = 0')
      .andWhere('video.id IS NOT NULL');

    if (title) {
      queryBuilder.andWhere('video.title LIKE :title', { title: `%${title}%` });
    }

    const videoEntities = await queryBuilder
      .limit(100)
      .orderBy('video_history.createdAt', 'DESC')
      .getRawMany();

    const list = videoEntities.map((record) => {
      if (record.video_id) {
        const video = new VideoEntity();
        video.id = record.video_id;
        video.title = record.video_title;
        video.filename = record.video_filename;
        video.path = record.video_path;
        video.classification = record.video_classification;
        // video.thumbnailPath = record.video_thumbnailPath;
        video.compressedThumbnailPath = record.video_compressedThumbnailPath;
        video.videoPath = record.video_videoPath;
        video.playTimes = record.video_playTimes;
        video.createdAt = record.video_history_created_at;
        video.duration = record.video_duration;
        video.size = record.video_size;
        return video;
      }
    });

    return list;
  }

  /**
   * 清空历史记录
   * @param userId
   */
  async clearHistoryByUserId(userId: number) {
    await this.historyRepository.delete({ userId });
  }
  /**
   * 清空收藏记录
   * @param userId
   */
  async clearFavoriteByUserId(userId: number) {
    await this.favoriteRepository.delete({ userId });
  }

  /**
   * 添加历史记录
   * @param userId
   * @param videoId
   * @returns
   */
  async addVideoToHistory(userId: number, videoId: number) {
    const existingHistory = await this.historyRepository.findOne({
      where: { userId, videoId },
    });
    // 如果找到历史记录，则删除它
    if (existingHistory) {
      existingHistory.createdAt = new Date(); // 这里假设 createdAt 字段类型为 Date
      return this.historyRepository.save(existingHistory);
    } else {
      const history = new HistoryEntity();
      history.userId = userId;
      history.videoId = videoId;
      return this.historyRepository.save(history);
    }
  }

  /**
   * 查询收藏
   * @param uid
   * @returns
   */
  async findFavoriteByUserId(uid: number, classification: string) {
    const queryBuilder = await this.favoriteRepository
      .createQueryBuilder('video_favorite')
      .leftJoinAndSelect(
        VideoEntity,
        'video',
        'video_favorite.videoId = video.id',
      )
      .where('video_favorite.userId = :uid', { uid })
      .andWhere('video.classification = :classification', {
        classification,
      })
      .andWhere('video.status = 0 ')
      .andWhere('video.id IS NOT NULL');

    const videoEntities = await queryBuilder
      .orderBy('video_favorite.createdAt', 'DESC')
      .getRawMany();

    this.logger.info('fffffffnew', videoEntities);

    const list = videoEntities.map((record) => {
      if (record.video_id) {
        const video = new VideoEntity();
        video.id = record.video_id;
        video.title = record.video_title;
        video.filename = record.video_filename;
        video.path = record.video_path;
        video.classification = record.video_classification;
        video.compressedThumbnailPath = record.video_compressedThumbnailPath;
        video.videoPath = record.video_videoPath;
        video.playTimes = record.video_playTimes;
        video.createdAt = record.video_favorite_created_at;
        video.duration = record.video_duration;
        video.size = record.video_size;

        return video;
      }
    });

    return list;
  }

  /**
   * 用户的收藏列表分类
   * @param userId
   * @returns
   */
  async favoriteClassifications(userId: number) {
    const classifications = await this.favoriteRepository
      .createQueryBuilder('video_favorite')
      .leftJoin(VideoEntity, 'video', 'video_favorite.videoId = video.id')
      .select('video.classification', 'classification') // 选择分类字段
      .where('video_favorite.userId = :userId', { userId })
      .andWhere('video.status = 0')
      .andWhere('video.id IS NOT NULL')
      .distinct(true) // 去重
      .orderBy('SUBSTRING(video.classification, 1, 1)', 'ASC') // 根据首字母排序
      .getRawMany();

    return classifications.map((item) => item.classification);
  }

  private async verifyVideo(
    userId: number,
    videoId: number,
    repository: any,
    entitiy: any,
    name: string,
    type: string,
  ) {
    const video = await this.findOne(videoId);

    if (!video) {
      return false; //视频不存在
    }
    const existingFavorite = await repository.findOne({
      where: { userId, videoId },
    });

    // if (existingFavorite) {
    //   // return false; // 如果收藏已存在，返回 null 或者可以返回 existingFavorite 表示已经收藏
    // } else {
    if (type === 'save') {
      const data = new entitiy();
      data.userId = userId;
      data.videoId = videoId;
      await repository.save(data);
    } else {
      await repository.delete({ userId, videoId });
    }

    await this.videoRepository
      .createQueryBuilder()
      .update(VideoEntity)
      .set({ [name]: () => `${name}` + `${type === 'save' ? '+1' : '-1'}` })
      .where('id = :id', { id: videoId }) // 修改这一行，确保传递正确的参数

      .execute();
    // }

    return true;
  }
  /**
   * 添加收藏
   * @param userId
   * @param videoId
   * @returns
   */
  async addVideoToFavorites(userId: number, videoId: number) {
    const isPass = await this.verifyVideo(
      userId,
      videoId,
      this.favoriteRepository,
      FavoriteEntity,
      'favorites',
      'save',
    );
    if (!isPass) return false;

    return true;
  }

  /**
   * 取消收藏
   * @param userId
   * @param videoId
   */
  async removeVideoFromFavorites(userId: number, videoId: number) {
    const isPass = await this.verifyVideo(
      userId,
      videoId,
      this.favoriteRepository,
      FavoriteEntity,
      'favorites',
      'delete',
    );
    if (!isPass) return false;

    return true;
  }

  /**
   * 点赞
   * @param userId
   * @param videoId
   */
  async likeVideo(userId: number, videoId: number) {
    const isPass = await this.verifyVideo(
      userId,
      videoId,
      this.likeRepository,
      LikeEntity,
      'likes',
      'save',
    );
    if (!isPass) return false;

    return true;
  }

  /**
   * 取消点赞
   * @param userId
   * @param videoId
   */
  async unlikeVideo(userId: number, videoId: number) {
    const isPass = await this.verifyVideo(
      userId,
      videoId,
      this.likeRepository,
      LikeEntity,
      'likes',
      'delete',
    );

    if (!isPass) return false;

    return true;
  }
  /**
   * 查询用户是否点过赞
   * @param userId
   * @param videoId
   * @returns
   */
  async checkUserLike(userId: number, videoId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { userId, videoId },
    });
    return !!like;
  }
  /**
   * 查询用户是否收藏过
   * @param userId
   * @param videoId
   * @returns
   */
  async checkUserFavorites(userId: number, videoId: number): Promise<boolean> {
    const favorites = await this.favoriteRepository.findOne({
      where: { userId, videoId },
    });
    return !!favorites;
  }

  /**
   * 首页最新视频及点赞+收藏最多
   * @param filter
   * @returns
   */
  async getHomeVideos() {
    const new_videos = await this.videoRepository
      .createQueryBuilder('video_upload')
      .orderBy('video_upload.createdAt', 'DESC')
      .where('video_upload.status = 0')
      .take(18)
      .getMany();

    const popular_videos = await this.videoRepository
      .createQueryBuilder('video_upload')
      .addSelect(
        '(0.3 * video_upload.playTimes + 0.3 * video_upload.likes + 0.4 * video_upload.favorites)',
        'popularity',
      )
      .orderBy('popularity', 'DESC')
      .where('video_upload.status = 0')
      .take(18)
      .getMany();
    this.logger.info('锋酱的popular_videos', popular_videos);

    const newVideos = new_videos.map((item) => ({
      ...item,
      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));

    const popularVideos = popular_videos.map((item) => ({
      ...item,
      path: `${this.configService.get<string>('API_BASE_URL')}/videos/compressedThumbnailPath/${item.id}`,
    }));

    return {
      newVideos,
      popularVideos,
    };
  }
  /**
   * 下一个视频
   * @param videoId
   * @param classification
   * @returns
   */
  async getNextVideo(
    videoId: number,
    classification: VIDEO_TYPE_ENUM,
  ): Promise<VideoEntity | null> {
    this.logger.info('锋酱的getNextVideo', videoId);

    // 查询同分类中比当前videoId大的下一个视频
    const nextVideo = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.classification = :classification', { classification })
      .andWhere('video.id < :videoId', { videoId })
      .andWhere('video.status = 0')
      .orderBy('video.id', 'DESC') // 按照videoId降序排列
      .getOne();
    return nextVideo || null; // 如果没有找到下一个视频，返回 null
  }
}
