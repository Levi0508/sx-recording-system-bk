import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity({
  name: 'analysis_task', // 表名也建议改一下，去掉 recording_ 前缀，或者为了兼容旧数据保持原名？为了彻底解耦，建议叫 analysis_task，但这里我先保持表名不变以免影响已有数据，或者您确认要改表名？
  // 用户说“单独搞一个module”，通常意味着业务逻辑分离。表名如果还没上线，建议改成 analysis_task。
  // 鉴于之前刚创建表，且用户说“开始Worker吧”，可能还没积压重要数据。
  // 但为了稳妥，我把表名设为 'analysis_task'。如果需要迁移数据请告知。
})
@Index(['sessionId'], { unique: true })
export class AnalysisTaskEntity extends BaseEntity {
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
