import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export type IRequestResource = void

export type IResponseResource = IlistItem

export const video$clear$favorite = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/favorite/clear',
    method: 'post',
    data,
  })
