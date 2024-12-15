import { LLMComentsDto } from "src/dtos/LLMComents.dto";
import { LLMComentsEntity } from "src/Entities/LLMComents.entity";

export interface ILLMComentsRepository {
    createLLMComents(llmComents: LLMComentsDto): Promise<LLMComentsEntity>;
    getLLMComentsByFilename(filename: string): Promise<LLMComentsDto[]>;
}