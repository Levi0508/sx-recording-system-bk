import { request } from '../helpers'

export interface IRequestResource {
  videoId: number
}

export interface IResponseResource {}

export const video$add$history = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/history/add',
    method: 'post',
    data,
  })
