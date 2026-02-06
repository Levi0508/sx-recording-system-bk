import { request } from '../helpers'

export interface IRequestResource {
  videoId: number
  commentId: number
  isReply: number
}

export type IResponseResource = void

export const comment$like$add = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/like/add',
    method: 'post',
    data,
  })
