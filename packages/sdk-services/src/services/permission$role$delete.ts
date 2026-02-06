import { request } from '../helpers'

export interface IRequestResource {
  id: number
}

export interface IResponseResource {}

export const permission$role$delete = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/permission/role/delete',
    method: 'POST',
    data,
  })
