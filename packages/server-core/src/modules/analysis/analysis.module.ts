import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';
import { TranscriptRecordEntity } from './entities/transcript-record.entity';
import { AnalysisRecordEntity } from './entities/analysis-record.entity';
import { AnalysisTaskService } from './analysis-task.service';
import { AnalysisRecordService } from './analysis-record.service';
import { TranscriptWorker } from './transcript.worker';
import { AnalysisWorker } from './analysis.worker';
import { AsrModule } from '../asr/asr.module';
import { RecordingModule } from '../recording/recording.module';
import { BailianModule } from '../bailian/bailian.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnalysisTaskEntity,
      TranscriptRecordEntity,
      AnalysisRecordEntity,
    ]),
    AsrModule,
    BailianModule,
    forwardRef(() => RecordingModule),
  ],
  providers: [
    AnalysisTaskService,
    AnalysisRecordService,
    TranscriptWorker,
    AnalysisWorker,
  ],
  exports: [
    AnalysisTaskService,
    AnalysisRecordService,
    TranscriptWorker,
    AnalysisWorker,
  ],
})
export class AnalysisModule {}
