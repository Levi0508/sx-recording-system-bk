import { request } from '../helpers'

export interface IRequestResource {
  goodsId: string
}

export interface IResponseResource {
  url: string
}

export const user$buy$month = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/buy/monthGoods',
    method: 'post',
    data,
  })
