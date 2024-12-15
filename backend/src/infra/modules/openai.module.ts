import { Module } from '@nestjs/common';
import { OpenaiService } from '@services/openai.service';
import { OpenaiController } from '@controllers/openai.controller';
import { DatabaseModule } from './database.module';
import { DocumentsModule } from './documents.module';

@Module({
  imports: [DatabaseModule, DocumentsModule],
  controllers: [OpenaiController],
  providers: [OpenaiService],
  exports: [OpenaiService]
})
export class OpenaiModule {}