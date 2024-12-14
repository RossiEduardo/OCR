import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './infra/modules/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './infra/modules/upload.module';
import { DocumentsModule } from './infra/modules/documents.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [UserModule, AuthModule, UploadModule, DocumentsModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
