import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export type IRequestResource = void

export type IResponseResource = IlistItem

export const video$clear$history = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/history/clear',
    method: 'post',
    data,
  })
