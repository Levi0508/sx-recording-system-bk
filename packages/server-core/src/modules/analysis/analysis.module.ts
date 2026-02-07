import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisTaskEntity } from './entities/analysis-task.entity';
import { AnalysisTaskService } from './analysis-task.service';
import { AnalysisWorker } from './analysis.worker';

@Module({
  imports: [TypeOrmModule.forFeature([AnalysisTaskEntity])],
  providers: [AnalysisTaskService, AnalysisWorker],
  exports: [AnalysisTaskService, AnalysisWorker],
})
export class AnalysisModule {}
