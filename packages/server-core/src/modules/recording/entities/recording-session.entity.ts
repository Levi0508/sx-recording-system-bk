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
}
