import { Module } from '@nestjs/common';
import { ExtractorService } from './extractor.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ExtractorService],
})
export class ExtractorModule {}
