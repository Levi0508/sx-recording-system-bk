import { request } from '../helpers'

export interface IRequestResource {
  id?: number
  email?: string
  currentPage?: number
  pageSize?: number
}

export interface IExchangeRecord {
  id: number
  userId: number
  goodsId: string
  price: number
  name: string
  goodsType: string
  createdAt: string
  userEmail?: string
  userNickname?: string
}

export interface IResponseResource {
  list: IExchangeRecord[]
  totalCount: number
}

export const user$exchange$query = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/exchange/query',
    method: 'post',
    data,
  })
