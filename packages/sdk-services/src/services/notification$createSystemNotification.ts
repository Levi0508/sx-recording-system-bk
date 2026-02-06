import { NOTIFICATION_TYPE_ENUM } from '@af-charizard/sdk-types'
import { request } from '../helpers'

export type IRequestResource = {
  message: string
  title: string
  email?: string //收件人
}

export type IResponseResource = void

export const notification$createSystemNotification = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/notification/createSystemNotification',
    method: 'post',
    data,
  })
