import { VIP_TYPE_ENUM } from '@af-charizard/sdk-types'
import { request } from '../helpers'
import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'

export type IRequestResource = void

interface IVipTopData {
  avatar: string
  id: number
  nickname: string
  vipDeadLine: string
  createdAt: string
  vipType: VIP_TYPE_ENUM
  payTotal: number
  avatarFrame: AVATAR_TYPE_ENUM
}
export type IResponseResource = IVipTopData[]

export const user$vip$top = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/vip/top',
    method: 'post',
    data,
  })
