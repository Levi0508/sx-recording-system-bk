import { Module } from '@nestjs/common';
import { BailianService } from './bailian.service';

@Module({
  providers: [BailianService],
  exports: [BailianService],
})
export class BailianModule {}
