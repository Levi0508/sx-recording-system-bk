import { request } from '../helpers'

export type IRequestResource = {
  goodsId: string
}

export type IResponseResource = any

export const signIn$getGift = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/sign-in/getGift',
    method: 'post',
    data,
  })
