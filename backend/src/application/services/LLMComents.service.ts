import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import OpenAI from "openai";
import { LLMComentsRepository } from 'src/infra/repositories/LLMComents.repository';


@Injectable()
export class LLMComentsService {
    constructor(
        @Inject('LLMCOMENTS_REPOSITORY')
        private readonly llmComentsRepository: LLMComentsRepository
    ){}

    private readonly openai = new OpenAI({apiKey: process.env.OPEN_AI_SECRET_KEY});
        
    // Function to generate comments on the text using LLM
    async generateLLMComents(documentId: string, text: string): Promise<string> {
        try {
            const stream = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `Por favor, explique o seguinte texto:\n\n${text}` }],
                max_tokens: 50,
                stream: true,
            });
            let content = '';
            for await (const chunk of stream) {
                content += (chunk.choices[0]?.delta?.content || "");
            }

            //save the comment in the database
            await this.llmComentsRepository.createLLMComents({text: content, document_id: documentId});

            return content;
        } catch (error) {
            console.error('Erro ao gerar explicação:', error);
            throw new Error('Falha ao interagir com o modelo de linguagem');
        }
    }

    async getLLMComentsByDocumentId(documentId: string): Promise<any[]> {
        return await this.llmComentsRepository.getLLMComentsByDocumentId(documentId);
    }

    // Function to answer a question about the document
    async makeQuestion(documentId: string, documentText: string, question: string): Promise<string> {
        try {
            const stream = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `Baseado no seguinte texto, responda a pergunta:\n\nTexto: ${documentText}\nPergunta: ${question}` }],
                max_tokens: 50,
                stream: true,
            });
            let content = '';
            for await (const chunk of stream) {
                content += (chunk.choices[0]?.delta?.content || "");
            }
            //save the comment in the database
            await this.llmComentsRepository.createLLMComents({text: content, document_id: documentId});
            return content;
        } catch (error) {
            console.error('Erro ao gerar explicação:', error);
            throw new Error('Falha ao interagir com o modelo de linguagem');
        }
    }
}
