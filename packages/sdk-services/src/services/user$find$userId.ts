import { VIP_TYPE_ENUM } from '@af-charizard/sdk-types'
import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'
import { request } from '../helpers'

export interface IRequestResource {
  userId: number
}

export interface IUserInfo {
  avatar: string
  avatarFrame: AVATAR_TYPE_ENUM
  id: number
  nickname: string
  vipDeadLine: string
  createdAt: string
  vipType: VIP_TYPE_ENUM
}
export type IResponseResource = IUserInfo
export const user$find$userId = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/find/userId',
    method: 'POST',
    data,
  })
