import { request } from '../helpers'

export type IRequestResource = {
  price: number
}
export type IResponseResource = void

export const user$pay = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/pay',
    method: 'post',
    data,
  })
