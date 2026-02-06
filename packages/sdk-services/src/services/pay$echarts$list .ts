import { request } from '../helpers'

export type IRequestResource = {
  month: string // 按月份搜索，格式: YYYYMM
}

export interface IEchartsData {
  date: string
  revenue: number
}
export type IResponseResource = IEchartsData[]

export const pay$echarts$list = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/echarts/list',
    method: 'post',
    data,
  })
