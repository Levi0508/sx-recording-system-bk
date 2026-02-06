import { Result } from 'src/utils/result';

export class BaseController {
  public success(resource?: any) {
    return Result.success(resource);
  }

  public error(message: string, code: number = 500, resource?: any) {
    return Result.error(message, code, resource);
  }
}
