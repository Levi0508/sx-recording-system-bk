export interface IDemoType {
  num: number
}

export const __demoType = (): IDemoType => ({
  num: 0,
})

export enum NOTIFICATION_TYPE_ENUM {
  USER = 'user',
  SYSTEM = 'system',
  VIDEO = 'video',
}

export enum VIP_TYPE_ENUM {
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
  THREE_YEARS = 'THREE_YEARS',
  PERMANENT = 'PERMANENT',
}

export enum FILTER_ENUM {
  PLAYTIMES = 'PLAYTIMES',
  LIKES = 'LIKES',
  FAVORITES = 'FAVORITES',
  NEW = 'NEW',
  POPULAR = 'POPULAR', // 按点赞+收藏数最多排序
}
