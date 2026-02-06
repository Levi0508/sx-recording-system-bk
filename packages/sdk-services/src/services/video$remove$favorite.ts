import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  videoId: number
}

export type IResponseResource = IlistItem

export const video$remove$favorite = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/favorite/remove',
    method: 'post',
    data,
  })
