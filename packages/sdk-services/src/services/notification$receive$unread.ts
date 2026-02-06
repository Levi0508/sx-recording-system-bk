import { request } from '../helpers'

export interface IRequestResource {
  currentPage: number
  pageSize: number
}

export interface INotificationList {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  title: string
  videoId: number
  message: string
  isRead: number
  type: string
  classification: any

  sendByUser: {
    id: number
    nickname: string
    avatar: string
  }
}

export type IResponseResource = {
  list: INotificationList[]
  totalCount: number
}

export const notification$receive$unread = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/notification/receive/unread',
    method: 'post',
    data,
  })
