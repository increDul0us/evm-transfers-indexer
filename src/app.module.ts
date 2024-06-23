import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ExtractorModule } from './extractor/extractor.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [ExtractorModule, TransfersModule],
  providers: [AppService],
})
export class AppModule {}
