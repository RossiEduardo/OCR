import { Inject, Injectable } from "@nestjs/common";
import { DocumentsDto } from "src/dtos/documents.dto";
import { DocumentsEntity } from "src/Entities/documents.entity";
import { IDocumentRepository } from "src/infra/repositories/interfaces/documents-repository.interface";

@Injectable()
export class DocumentsService{
    constructor(
        @Inject('DOCUMENTS_REPOSITORY')
        private readonly documentRepository: IDocumentRepository
    ){}

    async getUserDocuments(userusername: string): Promise<DocumentsDto[]>{
        try {
            const documents = await this.documentRepository.getUserDocuments(userusername);
            return documents;
        } catch (error) {
            throw new Error(`Failed to get user documents: ${error.message}`);
        }
    }

    getExtractedText(documentId: string){
        return this.documentRepository.getExtractedText(documentId);
    }

    async saveDocument(document: DocumentsDto): Promise<DocumentsDto>{
        try {
            return await this.documentRepository.saveDocument(document);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    

}