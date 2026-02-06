import { request } from '../helpers'

export type IRequestResource = {
  cardType: number
}

export type IResponseResource = void

export const pay$exchange_card$no_use_by_type = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/exchange_card/no_use_by_type',
    method: 'post',
    data,
  })
