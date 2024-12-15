import { ILLMComentsRepository } from "./interfaces/LLMComents-repository.interface";
import { LLMComentsEntity } from "src/Entities/LLMComents.entity";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { LLMComentsDto } from "src/dtos/LLMComents.dto";


@Injectable()
export class LLMComentsRepository implements ILLMComentsRepository{
    constructor(private readonly prisma: PrismaService) {}
    
    async createLLMComents(llmComents: LLMComentsDto): Promise<LLMComentsEntity> {
        try{
            const coments = await this.prisma.lLMComents.create({
                data: {
                    text: llmComents.text,
                    document_id: llmComents.document_id
                }
            });
            return coments;

        }catch(error){
            throw new Error('Error creating LLMComents');
        }
    }

    async getLLMComentsByFilename(filename: string): Promise<any[]> {
        const document = await this.prisma.documents.findUnique({
            where: {
                filename: filename
            },
            select: {
                id: true
            }
        });

        return await this.prisma.lLMComents.findMany({
            where: {
                document_id: document.id
            },
            select: {
                id: true,
                text: true,
            }
        });
    }
}