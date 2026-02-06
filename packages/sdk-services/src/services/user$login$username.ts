import { request } from '../helpers'

export interface IRequestResource {
  email: string
  password: string
  response: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
  purchasedMonthGoods?: Record<string, string>
  purchasedAnchorGoods?: Record<string, string>
  purchasedAnchorUpdatePackages?: Record<string, boolean>
}

export const user$login$username = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/login/username',
    method: 'POST',
    data,
  })
