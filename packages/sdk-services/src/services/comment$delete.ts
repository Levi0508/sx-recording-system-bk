import { request } from '../helpers'

export interface IRequestResource {
  commentId: number
  isReply: number
}

export type IResponseResource = void

export const comment$delete = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/delete',
    method: 'post',
    data,
  })
