import { request } from '../helpers'

export interface IRequestResource {
  redirectUri: string
  state: string
  code: string
}

export interface IResponseResource {
  passport: any
  user: any
  statements: any[]
}

export const oauth2$google$authorize = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/oauth2/google/authorize',
    method: 'POST',
    data,
  })
