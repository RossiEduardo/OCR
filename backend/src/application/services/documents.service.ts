import { Inject, Injectable } from "@nestjs/common";
import { DocumentsDto } from "src/dtos/documents.dto";
import { DocumentsEntity } from "src/Entities/documents.entity";
import { IDocumentRepository } from "src/infra/repositories/interfaces/documents-repository.interface";
import * as pdf from 'pdf-parse';
import * as fs from 'fs';

@Injectable()
export class DocumentsService{
    constructor(
        @Inject('DOCUMENTS_REPOSITORY')
        private readonly documentRepository: IDocumentRepository
    ){}

    async getUserDocuments(userId: string): Promise<DocumentsDto[]>{
        try{
            return await this.documentRepository.getUserDocuments(userId);
        }
        catch(error){
            throw error;
        }
    }

    async getFileContent(filePath: string){
        const dataBuffer = fs.readFileSync(filePath);
    
        try {
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            throw new Error('Error extracting text from PDF: ' + error.message);
        }
    }

    async getExtractedText(id: string): Promise<string>{
        try {
            return await this.documentRepository.getExtractedText(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async getDocumentById(documentId: string): Promise<DocumentsEntity>{
        try {
            return await this.documentRepository.getDocumentById(documentId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDocumentByFilename(filename: string): Promise<DocumentsEntity>{
        try {
            return await this.documentRepository.getDocumentByFilename(filename);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    

}