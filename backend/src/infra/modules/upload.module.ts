import { Module } from "@nestjs/common";
import { UploadService } from "@services/upload.service";
import { DatabaseModule } from "./database.module";
import { LocalUploadRepository } from "../repositories/local-upload.repository";
import { UserRepository } from "../repositories/user.repository";
import { DocumentsRepository } from "../repositories/documents.repository";
import { UserService } from "@services/user.service";
import { DocumentsService } from "@services/documents.service";

@Module({
    imports: [DatabaseModule],
    providers: [
        UploadService,
        {
            provide: 'UPLOAD_REPOSITORY',
            useClass: LocalUploadRepository, // Podemos trocar para o S3UploadRepository quando implmentado no futuro
        },
        UserService,
        {
            provide: 'USER_REPOSITORY',
            useClass: UserRepository, 
        },
        DocumentsService,
        {
            provide: 'DOCUMENTS_REPOSITORY',
            useClass: DocumentsRepository, 
        }
    ],
    exports: [UploadService],
})
export class UploadModule {}