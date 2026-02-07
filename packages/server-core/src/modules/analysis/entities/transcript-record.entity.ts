import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

/** 触发方式：worker 首次分析 | retranscribe 二次转写 */
export type TranscriptTriggerType = 'worker' | 'retranscribe';

@Entity({
  name: 'recording_transcript_record',
})
@Index(['sessionId', 'createdAt'])
export class TranscriptRecordEntity extends BaseEntity {
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 64,
  })
  sessionId!: string;

  /** 转写结果 JSON 在 OSS 的 objectKey：transcript/transcript_{id}.json */
  @Column({
    name: 'transcript_oss_key',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  transcriptOssKey?: string;

  /** worker | retranscribe */
  @Column({
    name: 'trigger_type',
    type: 'varchar',
    length: 32,
    default: 'worker',
  })
  triggerType!: TranscriptTriggerType;
}
