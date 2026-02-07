import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

/** 通用任务状态 */
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

@Entity({
  name: 'recording_analysis_task', // 与旧表名一致，若 DB 有表前缀则实际表名为 prefix_recording_analysis_task
})
@Index(['sessionId'], { unique: true })
export class AnalysisTaskEntity extends BaseEntity {
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 64,
  })
  sessionId!: string;

  /** 转写（ASR）状态：Worker 首轮 / 二次转写 可据此展示 */
  @Column({
    name: 'transcript_status',
    type: 'varchar',
    length: 32,
    default: 'pending',
  })
  transcriptStatus!: TaskStatus;

  /** 转写失败原因，failed 时写入 */
  @Column({
    name: 'transcript_error_message',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  transcriptErrorMessage?: string;

  /** 智能体分析状态：Worker 首轮 / 二次分析 可据此展示 */
  @Column({
    name: 'analysis_status',
    type: 'varchar',
    length: 32,
    default: 'pending',
  })
  analysisStatus!: TaskStatus;

  /** 智能体分析失败原因，failed 时写入 */
  @Column({
    name: 'analysis_error_message',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  analysisErrorMessage?: string;
}
