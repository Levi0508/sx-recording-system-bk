import { request } from '../helpers'

export interface IRequestResource {
  currentPage: number
  pageSize: number
}

export interface IOrderList {
  id: number
  name: string
  price: number
  createdAt: string
}
export type IResponseResource = {
  list: IOrderList[]
  totalCount: number
}

export const user$buy$order = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/buy/order',
    method: 'post',
    data,
  })
