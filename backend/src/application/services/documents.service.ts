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

    async getUserDocuments(username: string): Promise<DocumentsDto[]>{
        try {
            const documents = await this.documentRepository.getUserDocuments(username);
            return documents;
        } catch (error) {
            throw new Error(`Failed to get user documents: ${error.message}`);
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

    async getExtractedText(filename: string): Promise<string>{
        try {
            return await this.documentRepository.getExtractedText(filename);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async saveDocument(document: DocumentsDto): Promise<DocumentsDto>{
        try {
            return await this.documentRepository.saveDocument(document);
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