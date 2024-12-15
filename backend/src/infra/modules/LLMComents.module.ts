import { Module } from '@nestjs/common';
import { LLMComentsService } from '@services/LLMComents.service';
import { LLMComentsController } from '@controllers/LLMComents.controller';
import { DatabaseModule } from './database.module';
import { DocumentsModule } from './documents.module';

@Module({
  imports: [DatabaseModule, DocumentsModule],
  controllers: [LLMComentsController],
  providers: [LLMComentsService],
  exports: [LLMComentsService]
})
export class LLMComentsModule {}