import { request } from '../helpers'

export interface IRequestResource {
  id: number
}

export interface IResponseResource {
  list: any[]
}

export const video$findOneById = (params: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos' + `/${params.id}`,
    method: 'get',
  })
