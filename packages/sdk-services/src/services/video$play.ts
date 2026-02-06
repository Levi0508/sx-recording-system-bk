import { request } from '../helpers'

export interface IRequestResource {
  id: number
}

export interface IResponseResource {
  videoPath: string
}

export const video$play = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/play',
    method: 'post',
    data,
  })
