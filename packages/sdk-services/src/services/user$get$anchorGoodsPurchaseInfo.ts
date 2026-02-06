import { request } from '../helpers'

export interface IRequestResource {
  goodsId: string
}

export interface IResponseResource {
  hasUpdatePackage: boolean
  canAccess: boolean
  url: string | null
  allowUpdate: boolean // 该主播是否支持后续更新
}

export const user$get$anchorGoodsPurchaseInfo = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/get/anchorGoodsPurchaseInfo',
    method: 'post',
    data,
  })


