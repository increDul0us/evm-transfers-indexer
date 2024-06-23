import { Module } from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { ConfigModule } from '@nestjs/config';
import { TransfersModule } from 'src/transfers/transfers.module';

@Module({
  imports: [ConfigModule, TransfersModule],
  providers: [ExtractorService],
})
export class ExtractorModule {}
