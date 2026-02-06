import { AVATAR_TYPE_ENUM } from '@af-charizard/sdk-types/src/avatar-type'
import { request } from '../helpers'

export type IRequestResource = {
  avatar_frame_type?: AVATAR_TYPE_ENUM
}

export type IResponseResource = void

export const user$wear_avatar_frame = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/wear_avatar_frame',
    method: 'post',
    data,
  })
