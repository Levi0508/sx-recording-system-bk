import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';
import { AnalysisTaskService } from './analysis-task.service';
import { AnalysisWorker } from './analysis.worker';
import { AsrModule } from '../asr/asr.module';
import { RecordingModule } from '../recording/recording.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalysisTaskEntity]),
    AsrModule,
    forwardRef(() => RecordingModule),
  ],
  providers: [AnalysisTaskService, AnalysisWorker],
  exports: [AnalysisTaskService, AnalysisWorker],
})
export class AnalysisModule {}
