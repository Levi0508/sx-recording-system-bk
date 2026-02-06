import { request } from '../helpers'

export type IRequestResource = {
  month: string // 按月份搜索，格式: YYYYMM
}

export interface IEchartsData2 {
  date: string
  revenue: number
  ips: number
}
export type IResponseResource = IEchartsData2[]

export const signIn$echarts$list = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/sign-in/echarts/list',
    method: 'post',
    data,
  })
