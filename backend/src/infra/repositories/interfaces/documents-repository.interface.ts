import { DocumentsDto } from "src/dtos/documents.dto";
import { DocumentsEntity } from "src/Entities/documents.entity";

export interface IDocumentRepository {
    getUserDocuments(userId: string): Promise<DocumentsDto[]>;
    getExtractedText(documentId: string): Promise<string>;
    saveDocument(document: DocumentsDto): Promise<DocumentsDto>;
}