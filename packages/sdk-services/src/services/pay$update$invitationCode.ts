import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = {
  invitationCode: string
}

export const pay$update$invitationCode = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/update/invitationCode',
    method: 'post',
    data,
  })
