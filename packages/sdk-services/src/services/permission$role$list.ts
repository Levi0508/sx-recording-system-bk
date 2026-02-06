import { request } from '../helpers'

export interface IResponseResource extends Array<any> {}

export const permission$role$list = () =>
  request.request<IResponseResource>({
    url: '/permission/role/list',
    method: 'POST',
  })
