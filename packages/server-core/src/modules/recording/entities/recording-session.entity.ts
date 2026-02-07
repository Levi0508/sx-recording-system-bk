import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'recording_session',
})
export class RecordingSessionEntity extends BaseEntity {
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  sessionId?: string;

  @Column({
    name: 'client_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  clientName?: string;

  @Column({
    name: 'start_time',
    type: 'bigint',
    nullable: true,
  })
  startTime?: number;

  @Column({
    name: 'total_duration',
    type: 'float',
    default: 0,
  })
  totalDuration?: number;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 32,
    default: 'recording',
  })
  status?: string; // 'recording' | 'completed'

  /** 期望的分片总数（客户端上报），用于完整性校验 */
  @Column({
    name: 'expected_chunk_count',
    type: 'int',
    nullable: true,
  })
  expectedChunkCount?: number;

  /** 是否使用 OSS 存储（recordings/companyId/userId/sessionId/） */
  @Column({
    name: 'use_oss',
    type: 'tinyint',
    default: 0,
    nullable: true,
  })
  useOss?: number;
}
