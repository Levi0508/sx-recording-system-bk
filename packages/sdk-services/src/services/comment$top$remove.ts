import { request } from '../helpers'

export interface IRequestResource {
  commentId: number
}

export type IResponseResource = void

export const comment$top$remove = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/top/remove',
    method: 'post',
    data,
  })
