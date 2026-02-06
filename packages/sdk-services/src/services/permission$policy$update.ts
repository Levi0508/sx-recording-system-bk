import { request } from '../helpers'

export interface IRequestResource {
  id: number
  name: string
  description: string
  document: string
}

export interface IResponseResource {}

export const permission$policy$update = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/permission/policy/update',
    method: 'POST',
    data,
  })
