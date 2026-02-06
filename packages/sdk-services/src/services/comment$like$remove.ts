import { request } from '../helpers'

export interface IRequestResource {
  videoId: number
  commentId: number
  isReply: number
}

export type IResponseResource = void

export const comment$like$remove = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/like/remove',
    method: 'post',
    data,
  })
