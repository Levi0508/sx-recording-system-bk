import { request } from '../helpers'

export type IRequestResource = {
  email: string
  days: number
  type: string
}
export type IResponseResource = void

export const user$addVip$forUser = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/addVip/forUser',
    method: 'post',
    data,
  })
