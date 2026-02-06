import axios, {
  AxiosStatic,
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
  AxiosResponse,
} from 'axios'
import { createUUID } from '@kazura/web-util'
import { decryptResource } from './decrypt'

export interface HttpStatic extends AxiosStatic {}
export interface HttpInstance extends AxiosInstance {}
export interface HttpRequestConfig<D = any> extends AxiosRequestConfig<D> {}
export interface CreateHttpDefaults<D = any> extends CreateAxiosDefaults<D> {}
export interface HttpResponse<T = any, D = any> extends AxiosResponse<T, D> {}

export interface RequestPacket<T = string> {
  passport: string
  session: string
  resource: T
  sign: string
  other: null
}

export interface ResponsePacket<T = string> {
  code: number
  message: string
  success: boolean
  session: string
  resource: T
  sign: string
  other: null
}

export const http: HttpStatic = axios

export class Request {
  public instance: HttpInstance

  public constructor(config?: HttpRequestConfig) {
    this.instance = this.create(config)
  }

  public create(config?: HttpRequestConfig) {
    const instance = http.create(config)
    this.init(instance)
    return instance
  }

  public init(http: HttpInstance) {
    http.interceptors.request.use(
      (request) => {
        if (request.data === undefined) {
          request.data = {}
        }
        if (
          request.data &&
          Object.prototype.toString.call(request.data) === '[object Object]'
        ) {
          request.data = {
            passport: localStorage.getItem('__PASSPORT') || '',
            session: createUUID(),
            resource: request.data,
            sign: '',
            other: null,
          }
        }
        return request
      },
      (error) => {
        console.error(error)
        return Promise.reject(error)
      },
    )

    http.interceptors.response.use(
      (response: HttpResponse<ResponsePacket>) => {
        if (
          response.data &&
          Object.prototype.toString.call(response.data) === '[object Object]'
        ) {
          // 对 resource 进行解密
          if (response.data.resource) {
            try {
              response.data.resource = decryptResource(
                response.data.resource as string,
              )
            } catch (error) {
              console.error('Failed to decrypt resource:', error)
              // 根据需求处理解密失败的情况
            }
          }
        }
        return response
      },
      (error) => {
        console.error(error)
        return Promise.reject(error)
      },
    )
  }

  public request<
    T = any,
    D = any,
    R = HttpResponse<ResponsePacket<T>, RequestPacket>,
  >(config: HttpRequestConfig<D>): Promise<R> {
    return this.instance.request<T, R, D>(config)
  }
}
