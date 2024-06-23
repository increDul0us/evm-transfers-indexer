import { Module } from '@nestjs/common';
import { ExtractorModule } from './extractor/extractor.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [ExtractorModule, TransfersModule],
})
export class AppModule {}
