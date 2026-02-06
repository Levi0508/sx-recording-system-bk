import { request } from '../helpers'

export interface IRequestResource {
  clientIdentifier?: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
  purchasedMonthGoods?: Record<string, string>
  purchasedAnchorGoods?: Record<string, string>
  purchasedAnchorUpdatePackages?: Record<string, boolean>
}

export const passport$create = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/passport/create',
    method: 'POST',
    data,
  })
