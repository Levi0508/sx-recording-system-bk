import { request } from '../helpers'

export interface IRequestResource {}

export type IResponseResource = string[]

export const user$get$hotAnchors = (data?: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/get/hotAnchors',
    method: 'post',
    data: data || {},
  })


