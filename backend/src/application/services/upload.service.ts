import { Inject, Injectable } from "@nestjs/common";
import { IUploadRepository } from "src/infra/repositories/interfaces/upload-repository.interface";

@Injectable()
export class UploadService {
    constructor(
        @Inject('UPLOAD_REPOSITORY')
        private readonly uploadRepository: IUploadRepository,
    ){}

    async uploadFile(file: Express.Multer.File): Promise<string> {
        return this.uploadRepository.uploadFile(file);
    }
}