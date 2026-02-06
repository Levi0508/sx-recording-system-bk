import { request } from '../helpers'

export interface IRequestResource {
  id: number
  name: string
  description: string
  document: string
}

export interface IResponseResource {}

export const permission$policy$create = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/permission/policy/create',
    method: 'POST',
    data,
  })
