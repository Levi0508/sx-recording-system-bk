import { request } from '../helpers'

export type IRequestResource = {
  cardPassword: string
}

export type IResponseResource = void

export const pay$exchange$card = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/exchange/card',
    method: 'post',
    data,
  })
