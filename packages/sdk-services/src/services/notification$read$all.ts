import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = void

export const notification$read$all = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/notification/read/all',
    method: 'post',
    data,
  })
