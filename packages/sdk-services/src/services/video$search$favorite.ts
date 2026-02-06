import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  classification: string
}

export type IResponseResource = IlistItem[]

export const video$search$favorite = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/favorite/search',
    method: 'post',
    data,
  })
