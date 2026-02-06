import { request } from '../helpers'

export type IRequestResource = {
  currentPage: number
  pageSize: number
  nickname: string
  email: string
  ip: string
  isVip: string
  facility: string
  id: string
}

export interface IUserData {
  id: number
  createdAt: string
  updatedAt: string
  nickname: string
  email: string
  avatar: string
  money: number
  invitationUserId: number
  defaultInvitationCode: string
  ipAddress: string
  vipDeadLine: string
  isVip: boolean
}
export interface IResponseResource {
  list: IUserData[]
  totalCount: number
}

export const user$list = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/list',
    method: 'post',
    data,
  })
