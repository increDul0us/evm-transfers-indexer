import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExtractorModule } from './extractor/extractor.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [ExtractorModule, TransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
