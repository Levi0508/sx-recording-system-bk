import { request } from '../helpers'

export interface IRequestResource {
  email: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
}

export const email$sendCode$register = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/email/sendCode/register',
    method: 'POST',
    data,
  })
