import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  classification: any
  take?: number
}

export interface IResponseResource {
  list: IlistItem[]
}

export const video$random$classification = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/random/classification',
    method: 'POST',
    data,
  })
