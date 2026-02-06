import { request } from '../helpers'

export interface IRequestResource {
  email: string
  code: string
  password: string
  invitationCode: string
}

export interface IResponseResource {}

export const user$register$username = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/register/username',
    method: 'POST',
    data,
  })
