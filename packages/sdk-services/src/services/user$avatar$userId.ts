import { request } from '../helpers'

export interface IRequestResource {
  goodsId: string
}

export type IResponseResource = any

export const user$avatar$userId = () =>
  request.request<IResponseResource>({
    url: '/user/avatar/userId',
    method: 'get',
  })
