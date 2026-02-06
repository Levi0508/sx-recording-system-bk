import { request } from '../helpers'

export interface IRequestResource {
  nickname: string
}

export type IResponseResource = any

export const user$upload$avatar = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/user/upload/avatar',
    method: 'post',
    data,
    // headers: { 'Content-Type': 'multipart/form-data' },
  })
