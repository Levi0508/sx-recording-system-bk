import { request } from '../helpers'

export interface IRequestResource {
  goodsId: string
  includeUpdate?: boolean //是否包后续更新
}

export interface IResponseResource {
  url: string
}

export const user$buy$anchor = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/buy/anchorGoods',
    method: 'post',
    data,
  })

