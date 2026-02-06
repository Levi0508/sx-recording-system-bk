import { request } from '../helpers'

export type IRequestResource = {
  currentPage: number
  pageSize: number
}

export interface IDailyData {
  recordDate: string
  count: number
  registerCount: number
  dailyRevenue: number
}

export type IResponseResource = {
  list: IDailyData[]
  totalCount: number
}

export const passport$get$daily_data = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/passport/get/daily_data',
    method: 'POST',
    data,
  })
