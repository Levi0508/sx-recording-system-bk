import { request } from '../helpers'

export interface IRequestResource {
  email: string
}

export interface IResponseResource {
  days: number
  platformCoins: number
  moneyAdded: number
}

export const user$convert$vip = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/convert/vip',
    method: 'post',
    data,
  })

