import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = void

export const passport$update$visit_count = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/passport/update/visit_count',
    method: 'POST',
    data,
  })
