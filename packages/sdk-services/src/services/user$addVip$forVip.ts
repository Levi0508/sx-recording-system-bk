import { request } from '../helpers'

export type IRequestResource = {
  days: number
}
export type IResponseResource = void

export const user$addVip$forVip = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/addVip/forVip',
    method: 'post',
    data,
  })
