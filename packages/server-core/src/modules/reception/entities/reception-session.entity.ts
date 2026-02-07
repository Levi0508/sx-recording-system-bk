import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'reception_session' })
export class ReceptionSessionEntity extends BaseEntity {
  /** unique: true 已自带唯一索引，不再加 @Index 避免重复 */
  @Column({ name: 'session_id', type: 'varchar', length: 64, unique: true })
  sessionId!: string;

  @Column({ name: 'staff_id', type: 'int', nullable: true })
  staffId?: number;

  @Column({
    name: 'agreement_type',
    type: 'varchar',
    length: 64,
    default: 'recording_privacy',
  })
  agreementType?: string;

  /** 协议版本号，用于追溯用户确认时看到的是哪一版（如 "1" / "1.0"） */
  @Column({
    name: 'agreement_version',
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  agreementVersion?: string;

  @Index('IDX_reception_session_token')
  @Column({ name: 'token', type: 'varchar', length: 128 })
  token!: string;

  @Column({ name: 'token_expires_at', type: 'bigint' })
  tokenExpiresAt!: number;

  @Column({ name: 'status', type: 'varchar', length: 32, default: 'pending' })
  status!: string;

  @Column({ name: 'confirmed_at', type: 'bigint', nullable: true })
  confirmedAt?: number;

  @Column({ name: 'client_ip', type: 'varchar', length: 64, nullable: true })
  clientIp?: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 512, nullable: true })
  userAgent?: string;
}
