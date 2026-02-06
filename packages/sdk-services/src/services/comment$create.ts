import { request } from '../helpers'

export interface IRequestResource {
  videoId: number
  content: string
}

export type IResponseResource = void

export const comment$create = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/comment/create',
    method: 'post',
    data,
  })
