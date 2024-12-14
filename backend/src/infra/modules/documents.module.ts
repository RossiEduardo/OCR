import { Module } from '@nestjs/common';
import { DocumentsService } from '@services/documents.service';
import { DocumentsController } from '@controllers/documents.controller';
import { DocumentsRepository } from '../repositories/documents.repository';
import { DatabaseModule } from './database.module';
import { UploadModule } from './upload.module';
import { UserModule } from './user.module';

@Module({
    imports: [DatabaseModule, UploadModule, UserModule],
    controllers: [DocumentsController],
    providers: [DocumentsService,
        {
            provide: 'DOCUMENTS_REPOSITORY',
            useClass: DocumentsRepository
        }
    ],
    exports: [DocumentsService]
})
export class DocumentsModule {}