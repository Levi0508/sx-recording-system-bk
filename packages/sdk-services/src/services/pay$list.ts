import { request } from '../helpers'

export type IRequestResource = {
  currentPage: number
  pageSize: number
  month: string // 按月份搜索，格式: YYYYMM
  cardType: number // 卡类型过滤条件
  cardNumber: string // 卡号过滤条件
  cardPassword: string
}

export interface IExchangeData {
  userId: number
  exchangeAt: string
  cardType: number
  cardNumber: string
  cardPassword: string
}
export interface IResponseResource {
  list: IExchangeData[]
  totalCount: number
}

export const pay$list = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/list',
    method: 'post',
    data,
  })
