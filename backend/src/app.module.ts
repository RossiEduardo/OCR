import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './infra/modules/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './infra/modules/upload.module';
import { DocumentsModule } from './infra/modules/documents.module';
import { LLMComentsModule } from './infra/modules/LLMComents.module';

@Module({
  imports: [UserModule, AuthModule, UploadModule, DocumentsModule, LLMComentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
