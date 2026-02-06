import { request } from '../helpers'

export type IRequestResource = void
export interface IlistItem {
  classification: any
  createdAt: string
  deletedAt: string
  filename: string
  id: number
  path: string
  thumbnailPath: string
  title: string
  duration: number
  size: number
  updatedAt: string
  playTimes: number
  videoPath: string
  posterPath: string
  likes: number
  favorites: number
  hasLiked: boolean
  hasFavorited: boolean
}
export interface IResponseResource {
  list: IlistItem[]
}

export const video$findAll = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos',
    method: 'GET',
    data,
  })
