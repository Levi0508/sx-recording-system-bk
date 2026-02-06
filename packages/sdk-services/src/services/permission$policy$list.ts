import { request } from '../helpers'

export interface IResponseResource extends Array<any> {}

export const permission$policy$list = () =>
  request.request<IResponseResource>({
    url: '/permission/policy/list',
    method: 'POST',
  })
