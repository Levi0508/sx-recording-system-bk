import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = any

export const signIn$checkinInfo = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/sign-in/checkinInfo',
    method: 'post',
    data,
  })
