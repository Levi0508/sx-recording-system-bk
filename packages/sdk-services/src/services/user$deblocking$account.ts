import { request } from '../helpers'

export type IRequestResource = {
  email: string
}
export type IResponseResource = void

export const user$deblocking$account = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/deblocking/account',
    method: 'post',
    data,
  })
