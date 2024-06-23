import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExtractorModule } from './extractor/extractor.module';

@Module({
  imports: [ExtractorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
