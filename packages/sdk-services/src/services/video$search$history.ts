import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  title?: string
}

export type IResponseResource = IlistItem[]

export const video$search$history = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/history/search',
    method: 'post',
    data,
  })
