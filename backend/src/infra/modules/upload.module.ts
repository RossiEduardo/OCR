import { UploadController } from "@controllers/upload.controller";
import { Module } from "@nestjs/common";
import { UploadService } from "@services/upload.service";
import { DatabaseModule } from "./database.module";
import { LocalUploadRepository } from "../repositories/local-upload.repository";

@Module({
    imports: [DatabaseModule],
    controllers: [UploadController],
    providers: [
        UploadService,
        {
            provide: 'UPLOAD_REPOSITORY',
            useClass: LocalUploadRepository, // Podemos trocar para o S3UploadRepository quando implmentado no futuro
        }
    ],
    exports: [UploadService],
})
export class UploadModule {}