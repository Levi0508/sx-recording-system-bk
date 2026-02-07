import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingSessionEntity } from './entities/recording-session.entity';
import { RecordingChunkEntity } from './entities/recording-chunk.entity';
import { RecordingAnalysisTaskEntity } from './entities/recording-analysis-task.entity';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { RecordingOssService } from './recording-oss.service';
import { AnalysisTaskService } from './analysis-task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecordingSessionEntity,
      RecordingChunkEntity,
      RecordingAnalysisTaskEntity,
    ]),
  ],
  controllers: [RecordingController],
  providers: [RecordingService, RecordingOssService, AnalysisTaskService],
  exports: [RecordingService, AnalysisTaskService],
})
export class RecordingModule {}
