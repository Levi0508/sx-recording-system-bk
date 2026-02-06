import { request } from '../helpers'

export interface IRequestResource {
  id: number
}

export interface IResponseResource {}

export const permission$policy$delete = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/permission/policy/delete',
    method: 'POST',
    data,
  })
