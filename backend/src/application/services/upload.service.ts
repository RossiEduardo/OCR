import { Body, HttpException, HttpStatus, Inject, Injectable, UploadedFile } from "@nestjs/common";
import { DocumentsRepository } from "src/infra/repositories/documents.repository";
import { IUploadRepository } from "src/infra/repositories/interfaces/upload-repository.interface";
import { UserRepository } from "src/infra/repositories/user.repository";
import { DocumentsService } from "./documents.service";

@Injectable()
export class UploadService {
    constructor(
        @Inject('UPLOAD_REPOSITORY')
        private readonly uploadRepository: IUploadRepository,
        @Inject('USER_REPOSITORY')
        private readonly userRepository: UserRepository,
        @Inject('DOCUMENTS_REPOSITORY')
        private readonly documentsRepository: DocumentsRepository,
        private readonly documentsService: DocumentsService

    ){}


    async uploadFile(file: Express.Multer.File, userId: string): Promise<{ message: string, content: string }>{
        try{
            const user = await this.userRepository.getUserById(userId);

            // makde sure the filename is unique
            file.originalname = user.username + '_' + file.originalname;

            //Upload in the server, this path is the path of the file in the server 
            const filePath = await this.uploadRepository.uploadFile(file);
            const filePathDownload = process.env.UPLOAD_PATH + file.originalname;

            const fileContent = await this.documentsService.getFileContent(filePath);

            await this.documentsRepository.saveDocument({
                filename: file.originalname,
                filepathDownload: filePathDownload,
                filepath: filePath,
                user_id: user.id,
                content: fileContent
            });

            return { message: 'Documento salvo com sucesso', content: fileContent };
        }
        catch (error) {
            if (error.message === 'existingDocument') {
                throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'This document has already been uploaded' },
                HttpStatus.BAD_REQUEST,
                );
            }
            throw new HttpException(
                { status: HttpStatus.INTERNAL_SERVER_ERROR, error:`An error occurred while saving the document: ${error.message}` },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}