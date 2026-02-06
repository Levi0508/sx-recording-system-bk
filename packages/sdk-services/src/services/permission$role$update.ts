import { request } from '../helpers'

export interface IRequestResource {
  id: number
  name: string
  description: string
  document: string
}

export interface IResponseResource {}

export const permission$role$update = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/permission/role/update',
    method: 'POST',
    data,
  })
