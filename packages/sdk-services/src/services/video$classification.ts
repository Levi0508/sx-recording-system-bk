import { FILTER_ENUM } from '@af-charizard/sdk-types'
import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  currentPage: number
  pageSize: number
  sortType: FILTER_ENUM
  classification: string
  title?: string
  filename?: string
}

export interface IResponseResource {
  list: IlistItem[]
  totalCount: number
}

export const video$classification = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/classification',
    method: 'POST',
    data,
  })
