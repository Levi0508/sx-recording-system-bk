import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IRequestResource {
  title: string
  currentPage: number
  pageSize: number
}

export interface IResponseResource {
  list: IlistItem[]
  totalCount: number
}

export const video$search$title = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/search/title',
    method: 'post',
    data,
  })
