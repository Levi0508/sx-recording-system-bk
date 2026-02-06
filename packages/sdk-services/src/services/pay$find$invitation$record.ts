import { request } from '../helpers'

export type IRequestResource = {
  currentPage: number
  pageSize: number
}

export interface IInvitationItem {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  userId: number
  userNickname: string
  invitationId: string
  reward: number
}

export type IResponseResource = {
  list: IInvitationItem[]
  totalCount: number
  effectiveUserCount: number
  totalReward: number
}

export const pay$find$invitation$record = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/find/invitation/record',
    method: 'post',
    data,
  })
