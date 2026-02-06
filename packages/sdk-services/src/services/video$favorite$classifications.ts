import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export type IRequestResource = void

export type IResponseResource = IlistItem[]

export const video$favorite$classifications = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/favorite/classifications',
    method: 'post',
    data,
  })
