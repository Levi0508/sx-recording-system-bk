import { request } from '../helpers'

export interface IRequestResource {
  email: string
  password: string
  code: string
  response: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
}

export const user$reset$password = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/reset/password',
    method: 'POST',
    data,
  })
