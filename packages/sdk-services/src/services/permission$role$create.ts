import { request } from '../helpers'

export interface IRequestResource {
  id: number
  name: string
  description: string
  document: string
}

export interface IResponseResource {}

export const permission$role$create = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/permission/role/create',
    method: 'POST',
    data,
  })
