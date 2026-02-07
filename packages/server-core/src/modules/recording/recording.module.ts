import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingSessionEntity } from './entities/recording-session.entity';
import { RecordingChunkEntity } from './entities/recording-chunk.entity';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { RecordingOssService } from './recording-oss.service';
import { AnalysisModule } from '../analysis/analysis.module';
import { BailianModule } from '../bailian/bailian.module';
import { AsrModule } from '../asr/asr.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecordingSessionEntity, RecordingChunkEntity]),
    forwardRef(() => AnalysisModule),
    BailianModule,
    AsrModule,
  ],
  controllers: [RecordingController],
  providers: [RecordingService, RecordingOssService],
  exports: [RecordingService, RecordingOssService],
})
export class RecordingModule {}
