import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = {
  registeredUserCount: number
  visitCount: number
  dailyRegisteredUsers: number
}

export const user$register$info = () =>
  request.request<IResponseResource>({
    url: '/user/register/info',
    method: 'get',
  })
