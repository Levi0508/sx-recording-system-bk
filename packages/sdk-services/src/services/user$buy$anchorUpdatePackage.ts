import { request } from '../helpers'

export interface IRequestResource {
  goodsId: string
}

export interface IResponseResource {
  success: boolean
}

export const user$buy$anchorUpdatePackage = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/buy/anchorUpdatePackage',
    method: 'post',
    data,
  })

