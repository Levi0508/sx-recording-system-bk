import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TranscriptRecordEntity } from './transcript-record.entity';

/** 触发方式：worker 首次 | reanalyze 二次分析 | retranscribe_reanalyze 二次转写+分析 */
export type AnalysisTriggerType =
  | 'worker'
  | 'reanalyze'
  | 'retranscribe_reanalyze';

@Entity({
  name: 'recording_analysis_record',
})
@Index(['sessionId', 'createdAt'])
export class AnalysisRecordEntity extends BaseEntity {
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 64,
  })
  sessionId!: string;

  /** 关联的转写记录（本分析基于该转写） */
  @Column({
    name: 'transcript_record_id',
    type: 'int',
  })
  transcriptRecordId!: number;

  @ManyToOne(() => TranscriptRecordEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'transcript_record_id' })
  transcriptRecord?: TranscriptRecordEntity;

  /** 分析结果 JSON 在 OSS 的 objectKey：analysis/analysis_result_{id}.json */
  @Column({
    name: 'result_oss_key',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  resultOssKey?: string;

  /** worker | reanalyze | retranscribe_reanalyze */
  @Column({
    name: 'trigger_type',
    type: 'varchar',
    length: 32,
    default: 'worker',
  })
  triggerType!: AnalysisTriggerType;
}
