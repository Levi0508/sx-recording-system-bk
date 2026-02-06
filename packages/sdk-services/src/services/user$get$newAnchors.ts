import { request } from '../helpers'

export interface IRequestResource {}

export type IResponseResource = string[]

export const user$get$newAnchors = (data?: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/get/newAnchors',
    method: 'post',
    data: data || {},
  })


