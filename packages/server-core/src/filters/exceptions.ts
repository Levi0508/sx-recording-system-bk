import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export class ExceptionInit {
  constructor(
    public readonly response: string | Record<string, any>,
    public readonly status: number,
    public readonly options?: HttpExceptionOptions,
  ) {}
}

export class Exception extends HttpException {
  constructor(init: ExceptionInit) {
    const { response, status, options } = init;
    super(response, status, options);
  }
}

export class Exceptions {
  /**
   * 未登录
   */
  public static readonly NoLogin = new ExceptionInit('未登录', -101);

  /**
   * 重复登录
   */
  public static readonly DuplicateLogin = new ExceptionInit('重复登录', -102);

  /**
   * 服务器繁忙
   */
  public static readonly ServerErr = new ExceptionInit('服务器繁忙', -500);

  /**
   * 访问权限不足
   */
  public static readonly PermissionDeniedError = new ExceptionInit(
    '访问权限不足',
    -403,
  );

  /**
   * 通行证过期
   */
  public static readonly PassportExpiredError = new ExceptionInit(
    '通行证过期,请刷新页面重新登录',
    -10001,
  );

  /**
   * 验证码错误
   */
  public static readonly CaptchaError = new ExceptionInit('验证码错误', -10002);

  /**
   * 登录错误
   */
  public static readonly LoginError = new ExceptionInit(
    '账号或密码错误',
    -10003,
  );
}
