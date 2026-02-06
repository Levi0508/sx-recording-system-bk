import { request } from '../helpers'

export type IRequestResource = {
  userId?: number
  referrer: string
}

export type IResponseResource = any

export const signIn$handle = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/sign-in/handle',
    method: 'post',
    data,
  })
