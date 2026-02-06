import type { HttpException } from '@nestjs/common';
import type { Request } from 'express';

export class Result {
  /**
   * 响应码
   */
  public code = 200;
  /**
   * 响应消息
   */
  public message = 'OK';
  /**
   * 是否成功
   */
  public success = true;
  /**
   * 会话序号
   */
  public session = '';
  /**
   * 响应数据
   */
  public resource: any = null;
  /**
   * 签名
   */
  public sign = '';
  /**
   * 其他数据
   */
  public other: any = null;

  /**
   *
   * @param resource
   * @param exception
   */
  public constructor(resource: any) {
    this.resource = resource;
  }

  /**
   * 根据 Http Request 更新 Result
   * @param request
   */
  public update(request: Request) {
    if (typeof request.body === 'object' && request.body.session) {
      this.session = request.body.session;
    }
  }
  public static success(resource?: any) {
    return new Result(resource);
  }

  public static exception(exception: HttpException, resource?: any) {
    const result = new Result(resource);
    const response = exception.getResponse();
    result.resource = response !== exception.message ? response : null;
    result.code = exception.getStatus();
    result.message = exception.message;
    return result;
  }

  public static error(message: string, code: number = 500, resource?: any) {
    const result = new Result(resource);
    result.message = message;
    result.code = code;
    return result;
  }
}
