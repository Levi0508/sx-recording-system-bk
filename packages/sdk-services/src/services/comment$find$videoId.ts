import { VIP_TYPE_ENUM } from '@af-charizard/sdk-types'
import { request } from '../helpers'
import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'

export interface IRequestResource {
  videoId: number
}

export interface IReplies {
  id: number
  content: string
  likeNum: number
  createdAt: string
  isReply: number
  hasLiked: boolean
  replyIsReply: number
  user: {
    id: number
    nickname: string
    vipDeadLine: string
    avatar: string
    vipType: VIP_TYPE_ENUM
    avatarFrame: AVATAR_TYPE_ENUM
  }
  replyUser?: {
    id: number
    nickname: string
  }
}
export interface ICommentList {
  id: number
  content: string
  likeNum: number
  isTop: number
  isReply: number
  createdAt: string
  hasLiked: boolean

  user: {
    id: number
    nickname: string
    vipDeadLine: string
    avatar: string
    vipType: VIP_TYPE_ENUM
    avatarFrame: AVATAR_TYPE_ENUM
  }
  videoId: number
  replies: {
    count: number
    list: IReplies[]
  }
}

export type IResponseResource = {
  list: ICommentList[]
  totalCount: number
}

export const comment$find$videoId = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/find/videoId',
    method: 'post',
    data,
  })
