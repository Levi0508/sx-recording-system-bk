import { BaseEntity } from 'src/base/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity({
  name: 'recording_chunk',
})
@Index(['sessionId', 'chunkId'], { unique: true })
export class RecordingChunkEntity extends BaseEntity {
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 64,
  })
  @Index()
  sessionId?: string;

  @Column({
    name: 'chunk_id',
    type: 'int',
  })
  chunkId?: number;

  @Column({
    name: 'duration',
    type: 'float',
    default: 0,
  })
  duration?: number;

  @Column({
    name: 'file_path',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  filePath?: string;

  /** OSS 直传时的 Object Key，与 filePath 二选一 */
  @Column({
    name: 'oss_object_key',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  ossObjectKey?: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 32,
    default: 'uploaded',
  })
  status?: string;
}
