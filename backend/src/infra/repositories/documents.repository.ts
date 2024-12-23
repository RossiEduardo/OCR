import { Injectable } from "@nestjs/common";
import { IDocumentRepository } from "./interfaces/documents-repository.interface";
import { PrismaService } from "src/prisma.service";
import { DocumentsDto } from "src/dtos/documents.dto";
import { DocumentsEntity } from "src/Entities/documents.entity";

@Injectable()

export class DocumentsRepository implements IDocumentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getUserDocuments(userId: string): Promise<DocumentsDto[]>{
        try{
            const docs = await this.prisma.documents.findMany({
                where: {
                    user: { id: userId }
                }
            });
            return docs.map(doc => new DocumentsDto(doc));
        }
        catch(error){
            throw new Error(error.message);
        }
    }
    
    async getExtractedText(id: string): Promise<string>{
        try{
            const message = await this.prisma.documents.findUnique({
                where: {
                    id: id
                },
                select: {
                    content: true
                }
            });
            return message.content;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    async saveDocument(document: DocumentsDto): Promise<DocumentsDto> {
        try {
            const existingDocument = await this.prisma.documents.findUnique({
                where: { 
                    filename: document.filename,
                    user_id: document.user_id
                },
            });
            if (existingDocument) {
                throw new Error('Document already exists');
            }

            const newDocument = await this.prisma.documents.create({
                data: {
                    filename: document.filename,
                    filepath: document.filepath,
                    filepathDownload: document.filepathDownload,
                    user_id: document.user_id,
                    content: document.content,
                }
            });
            return newDocument;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDocumentById(documentId: string): Promise<DocumentsEntity> {
        try {
            return await this.prisma.documents.findUnique({
                where: {
                    id: documentId,
                },
                include: {
                    user: true
                }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDocumentByFilename(filename: string): Promise<DocumentsEntity> {
        try {
            return await this.prisma.documents.findUnique({
                where: {
                    filename: filename,
                },
                include: {
                    user: true,
                    LLMComents: true
                }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}