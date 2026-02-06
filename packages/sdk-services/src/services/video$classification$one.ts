import { FILTER_ENUM } from '@af-charizard/sdk-types'
import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  classification: string
}

export interface IResponseResource {
  list: IlistItem[]
  totalCount: number
}

export const video$classification$one = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/classification/one',
    method: 'POST',
    data,
  })
