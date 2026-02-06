import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = any

export const signIn$checkin = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/sign-in/checkin',
    method: 'post',
    data,
  })
