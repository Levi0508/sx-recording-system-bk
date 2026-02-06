import { request } from '../helpers'

export interface IRequestResource {
  commentId: number
}

export type IResponseResource = void

export const comment$top$add = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/top/add',
    method: 'post',
    data,
  })
