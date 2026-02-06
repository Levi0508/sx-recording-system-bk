import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  goodsId: string
}

export type IResponseResource = IlistItem

export const user$buy$vip = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/buy/vip',
    method: 'post',
    data,
  })
