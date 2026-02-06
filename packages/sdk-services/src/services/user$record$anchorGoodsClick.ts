import { request } from '../helpers'

export interface IRequestResource {
  goodsId: string
  url?: string
}

export interface IResponseResource {}

export const user$record$anchorGoodsClick = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/record/anchorGoodsClick',
    method: 'post',
    data,
  })

