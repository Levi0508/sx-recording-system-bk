import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity({
  name: 'recording_analysis_task',
})
@Index(['sessionId'], { unique: true })
export class RecordingAnalysisTaskEntity extends BaseEntity {
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 64,
  })
  sessionId!: string;

  /** pending | processing | completed | failed */
  @Column({
    name: 'status',
    type: 'varchar',
    length: 32,
    default: 'pending',
  })
  status!: string;

  /** 分析逻辑版本号（如 "rules-v1.0.0+asr-v2"），用于合规追溯 */
  @Column({
    name: 'version',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  version?: string;

  /** 分析结果（JSON 或摘要），completed 时写入 */
  @Column({
    name: 'result',
    type: 'text',
    nullable: true,
  })
  result?: string;

  /** 失败原因，failed 时写入 */
  @Column({
    name: 'error_message',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  errorMessage?: string;
}
