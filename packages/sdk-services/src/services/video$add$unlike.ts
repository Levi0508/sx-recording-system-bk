import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  videoId: number
}

export type IResponseResource = IlistItem

export const video$add$unlike = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/like/remove',
    method: 'post',
    data,
  })
