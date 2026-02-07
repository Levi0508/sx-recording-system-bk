import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { ReceptionSessionEntity } from './entities/reception-session.entity';

const TOKEN_EXPIRES_SEC = 10 * 60;

@Injectable()
export class ReceptionService {
  constructor(
    @InjectRepository(ReceptionSessionEntity)
    private readonly repo: Repository<ReceptionSessionEntity>,
  ) {}

  /** 当前协议版本，协议文案变更时递增 */
  private static readonly CURRENT_AGREEMENT_VERSION = '1';

  async createSession(
    staffId?: number,
    agreementType: string = 'recording_privacy',
    agreementVersion?: string,
  ) {
    const sessionId = `reception_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const token = randomBytes(24).toString('hex');
    const tokenExpiresAt = Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_SEC;
    const version =
      agreementVersion ?? ReceptionService.CURRENT_AGREEMENT_VERSION;
    const session = new ReceptionSessionEntity();
    session.sessionId = sessionId;
    session.staffId = staffId;
    session.agreementType = agreementType;
    session.agreementVersion = version;
    session.token = token;
    session.tokenExpiresAt = tokenExpiresAt;
    session.status = 'pending';
    await this.repo.save(session);
    return {
      sessionId,
      token,
      tokenExpiresAt,
      agreementType,
      agreementVersion: version,
    };
  }

  async confirmByToken(
    token: string,
    clientIp?: string,
    userAgent?: string,
  ): Promise<{ sessionId: string } | null> {
    const now = Math.floor(Date.now() / 1000);
    const session = await this.repo.findOne({
      where: { token, status: 'pending' },
    });
    if (!session || session.tokenExpiresAt < now) return null;
    session.status = 'confirmed';
    session.confirmedAt = Date.now();
    session.clientIp = clientIp ?? undefined;
    session.userAgent = userAgent ?? undefined;
    await this.repo.save(session);
    return { sessionId: session.sessionId };
  }

  async getStatus(
    sessionId: string,
  ): Promise<{ status: string; confirmedAt?: number } | null> {
    const session = await this.repo.findOne({
      where: { sessionId },
      select: ['status', 'confirmedAt'],
    });
    if (!session) return null;
    return {
      status: session.status!,
      confirmedAt: session.confirmedAt ?? undefined,
    };
  }
}
