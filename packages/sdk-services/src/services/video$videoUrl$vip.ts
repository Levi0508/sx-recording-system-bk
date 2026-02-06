import { request } from '../helpers'
import { IlistItem } from './video$findAll'

export interface IExtendedListItem extends IlistItem {
  nextVideo: {
    nextVideoPath: string
  } & IlistItem // 使用交叉类型将 IlistItem 合并到 nextVideo 中
}
export interface IRequestResource {
  videoId: number
  classification: any
}

export type IResponseResource = IExtendedListItem

export const video$videoUrl$vip = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: '/videos/videoUrl/vip',
    method: 'post',
    data,
  })
