import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseController } from 'src/base/BaseController';
import { ReqUser } from 'src/decorators/req-user';
import { UserEntity } from '../user/entities/user.entity';
import { ServiceException } from 'src/common/ServiceException';
import { IsString } from 'class-validator';
import { ReceptionService } from './reception.service';

class ConfirmDto {
  @IsString()
  token!: string;
}

@Controller('reception')
export class ReceptionController extends BaseController {
  constructor(private readonly receptionService: ReceptionService) {
    super();
  }

  /**
   * 客服点击「开始接待」：创建接待会话，返回 sessionId、token、二维码 payload（客户扫码打开的 URL 需由前端拼接）
   */
  @Post('create')
  async create(@ReqUser(true) user: UserEntity) {
    const staffId = user?.id != null ? Number(user.id) : undefined;
    const result = await this.receptionService.createSession(
      staffId,
      'recording_privacy',
    );
    return this.success(result);
  }

  /**
   * 客户扫码后在协议页点击「确认」：无需登录，凭 token 确认
   */
  @Post('confirm')
  async confirm(@Body() dto: ConfirmDto, @Req() req: Request) {
    const token = typeof dto?.token === 'string' ? dto.token.trim() : '';
    if (!token) {
      throw new ServiceException('token 不能为空', 400);
    }
    const clientIp =
      (req as any).ip ?? req.headers?.['x-forwarded-for'] ?? undefined;
    const userAgent = req.headers?.['user-agent'] ?? undefined;
    const result = await this.receptionService.confirmByToken(
      token,
      clientIp,
      userAgent,
    );
    if (!result) {
      throw new ServiceException('链接已失效或已确认，请重新扫码', 400);
    }
    return this.success(result);
  }

  /**
   * 客户扫码打开的协议页（返回 HTML，需用 Res 直接输出避免被加密拦截）
   */
  @Get('agreement')
  agreementPage(@Query('token') token: string, @Res() res: Response) {
    const t = typeof token === 'string' ? token.trim() : '';
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>录音与隐私协议</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; line-height: 1.6; }
    h2 { font-size: 18px; }
    .agree { margin: 24px 0; }
    button { padding: 12px 24px; font-size: 16px; background: #007AFF; color: #fff; border: none; border-radius: 8px; width: 100%; }
    button:disabled { opacity: 0.6; }
    .msg { margin-top: 16px; color: #666; }
  </style>
</head>
<body>
  <h2>录音与隐私告知</h2>
  <p>本次服务过程中，为保障服务质量与合规留痕，将进行现场录音。录音仅用于内部质控与培训，我们会严格保护您的个人信息。</p>
  <p>请您阅读后点击下方「确认」表示同意。</p>
  <div class="agree">
    <button id="btn" ${!t ? 'disabled' : ''}>确认</button>
  </div>
  <div class="msg" id="msg"></div>
  <script>
    var token = ${JSON.stringify(t)};
    document.getElementById('btn').onclick = function() {
      var btn = this;
      btn.disabled = true;
      btn.textContent = '提交中...';
      fetch(window.location.origin + '/reception/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      }).then(function(r) { return r.json(); }).then(function(d) {
        if (d && d.success) {
          document.getElementById('msg').textContent = '您已确认，感谢配合。';
          btn.textContent = '已确认';
        } else {
          document.getElementById('msg').textContent = d && d.message ? d.message : '提交失败，请重试';
          btn.disabled = false;
          btn.textContent = '确认';
        }
      }).catch(function() {
        document.getElementById('msg').textContent = '网络错误，请重试';
        btn.disabled = false;
        btn.textContent = '确认';
      });
    };
  </script>
</body>
</html>`;
    res.type('text/html').send(html);
  }

  /**
   * 平板轮询：获取接待会话状态，用于展示「客户已确认」
   */
  @Get('session/:sessionId/status')
  async getStatus(@Param('sessionId') sessionId: string) {
    const result = await this.receptionService.getStatus(sessionId);
    if (!result) {
      throw new ServiceException('会话不存在', 404);
    }
    return this.success(result);
  }
}
