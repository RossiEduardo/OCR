import { Injectable } from "@nestjs/common";
import { IDocumentRepository } from "./interfaces/documents-repository.interface";
import { PrismaService } from "src/prisma.service";
import { DocumentsDto } from "src/dtos/documents.dto";
import { DocumentsEntity } from "src/Entities/documents.entity";

@Injectable()

export class DocumentsRepository implements IDocumentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getUserDocuments(userEmail: string): Promise<DocumentsDto[]>{
        const docs = await this.prisma.documents.findMany({
            where: {
                user: { email: userEmail }
            }
        });
        return docs.map(doc => new DocumentsDto(doc));
    }
    
    getExtractedText(documentId: string): Promise<string>{
        throw new Error("Method not implemented.");
    }

    async saveDocument(document: DocumentsDto): Promise<DocumentsDto> {
        try {
            const existingDocument = await this.prisma.documents.findUnique({
                where: { filename: document.filename },
            });

            if (existingDocument) {
                throw new Error('Document already exists');
            }

            const newDocument = await this.prisma.documents.create({
                data: {
                    filename: document.filename,
                    filepath: document.filepath,
                    user_id: document.user_id
                }
            });
            return newDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}