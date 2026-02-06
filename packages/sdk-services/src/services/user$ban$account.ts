import { request } from '../helpers'

export type IRequestResource = {
  email: string
  days: number
}
export type IResponseResource = void

export const user$ban$account = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/ban/account',
    method: 'post',
    data,
  })
