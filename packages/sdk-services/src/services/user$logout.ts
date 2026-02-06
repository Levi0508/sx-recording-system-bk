import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = void

export const user$logout = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/logout',
    method: 'post',
    data,
  })
