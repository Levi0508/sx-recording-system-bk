import { request } from '../helpers'
import { IExtendedListItem } from './video$videoUrl$vip'

export interface IRequestResource {
  videoId: number
  classification: any
}

export type IResponseResource = IExtendedListItem

export const video$videoUrl$default = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/videoUrl/default',
    method: 'post',
    data,
  })
