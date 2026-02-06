import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export type IRequestResource = void

export interface IHome {
  newVideos: IlistItem[]
  popularVideos: IlistItem[]
}

export type IResponseResource = IHome

export const video$home = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/home',
    method: 'post',
    data,
  })
