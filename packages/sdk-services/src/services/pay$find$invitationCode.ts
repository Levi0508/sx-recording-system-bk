import { request } from '../helpers'

export type IRequestResource = void

export type IResponseResource = {
  invitationCode: string
}

export const pay$find$invitationCode = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/pay/find/invitationCode',
    method: 'post',
    data,
  })
