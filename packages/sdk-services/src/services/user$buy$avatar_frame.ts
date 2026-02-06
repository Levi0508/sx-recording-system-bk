import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'
import { request } from '../helpers'

export interface IRequestResource {
  goodsId: AVATAR_TYPE_ENUM
  isWear?: boolean
}

export type IResponseResource = void

export const user$buy$avatar_frame = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/buy/avatar_frame',
    method: 'post',
    data,
  })
