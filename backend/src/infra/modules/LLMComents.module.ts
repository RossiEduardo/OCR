import { Module } from '@nestjs/common';
import { LLMComentsService } from '@services/LLMComents.service';
import { LLMComentsController } from '@controllers/LLMComents.controller';
import { DatabaseModule } from './database.module';
import { DocumentsModule } from './documents.module';
import { LLMComentsRepository } from '../repositories/LLMComents.repository';

@Module({
  imports: [DatabaseModule, DocumentsModule],
  controllers: [LLMComentsController],
  providers: [
    LLMComentsService,
    {
      provide: 'LLMCOMENTS_REPOSITORY',
      useClass: LLMComentsRepository
    }
  ],
  exports: [LLMComentsService]
})
export class LLMComentsModule {}