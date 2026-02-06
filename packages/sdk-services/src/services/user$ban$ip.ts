import { HttpResponse, RequestPacket, ResponsePacket } from '@af-charizard/sdk-utils'
import { request } from '../helpers'

export interface IRequestResource {
  ip: string
}

export const user$ban$ip = (
  data: IRequestResource,
): Promise<HttpResponse<ResponsePacket<void>, RequestPacket<IRequestResource>>> => {
  return request.instance.post('/user/ban/ip', data)
}
