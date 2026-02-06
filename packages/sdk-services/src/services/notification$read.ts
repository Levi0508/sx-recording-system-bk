import { request } from '../helpers'

export type IRequestResource = {
  notificationId: number
}

export type IResponseResource = void

export const notification$read = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/notification/read',
    method: 'post',
    data,
  })
