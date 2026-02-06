import { request } from '../helpers'

export interface IRequestResource {
  redirectUri: string
}

export interface IResponseResource {
  redirectUri: string
}

export const oauth2$google$redirect = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/oauth2/google/redirect',
    method: 'POST',
    data,
  })
