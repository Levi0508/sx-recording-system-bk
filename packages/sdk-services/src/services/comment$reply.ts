import { request } from '../helpers'

export interface IRequestResource {
  content: string
  commentId: number
  isReply: number
}

export type IResponseResource = void

export const comment$reply = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/reply',
    method: 'post',
    data,
  })
