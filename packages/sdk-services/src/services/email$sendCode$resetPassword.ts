import { request } from '../helpers'

export interface IRequestResource {
  email: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
}

export const email$sendCode$resetPassword = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/email/sendCode/resetPassword',
    method: 'POST',
    data,
  })
