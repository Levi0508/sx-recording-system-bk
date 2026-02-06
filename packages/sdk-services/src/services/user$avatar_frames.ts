import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'
import { request } from '../helpers'

export type IRequestResource = void

export interface IAvatarData {
  userId: number
  avatarFrame: AVATAR_TYPE_ENUM
  price: number
  expiryDate: string
  isValid: boolean // 添加有效性检查
}
export type IResponseResource = IAvatarData[]

export const user$avatar_frames = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/avatar_frames',
    method: 'post',
    data,
  })
