import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  classification: any[]
  take?: number
}

export interface IResult {
  classification: any
  videos: IlistItem[]
}
export interface IResponseResource {
  list: IResult[]
}

export const video$more$classification = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/more/classification',
    method: 'POST',
    data,
  })
