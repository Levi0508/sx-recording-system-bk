import { request } from '../helpers'

export type IRequestResource = {
  count: number
  cardType: number
}

export type IResponseResource = void

export const pay$exchange_card$create = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/exchange_card/create',
    method: 'post',
    data,
  })
