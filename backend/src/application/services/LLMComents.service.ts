import { Injectable } from '@nestjs/common';
import axios from 'axios';
import OpenAI from "openai";


@Injectable()
export class LLMComentsService {
    private readonly openai = new OpenAI({apiKey: process.env.OPEN_AI_SECRET_KEY});
        
    // Função para gerar explicações sobre o texto
    async generateExplanation(text: string): Promise<string> {
        try {
            const stream = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `Por favor, explique o seguinte texto:\n\n${text}` }],
                stream: true,
            });
            let content = '';
            for await (const chunk of stream) {
                content += (chunk.choices[0]?.delta?.content || "");
            }
            return content;
        } catch (error) {
            console.error('Erro ao gerar explicação:', error);
            throw new Error('Falha ao interagir com o modelo de linguagem');
        }
    }

    // // Função para responder a uma pergunta sobre o documento
    // async askQuestion(documentText: string, question: string): Promise<string> {
    //     try {
    //     const response = await axios.post(
    //         this.openaiEndpoint,
    //         {
    //         model: 'gpt-4',
    //         prompt: `Baseado no seguinte texto, responda a pergunta:\n\nTexto: ${documentText}\nPergunta: ${question}`,
    //         max_tokens: 150,
    //         temperature: 0.7,
    //         },
    //         {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${this.openaiApiKey}`,
    //         },
    //         }
    //     );

    //     return response.data.choices[0].text.trim(); // Resposta gerada pelo modelo
    //     } catch (error) {
    //     console.error('Erro ao perguntar ao LLM:', error);
    //     throw new Error('Falha ao interagir com o modelo de linguagem');
    //     }
    // }

//   async testeGPT(){
//     const stream = await this.openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: "Do you read files?" }],
//         stream: true,
//     });
//     for await (const chunk of stream) {
//         console.log(chunk.choices[0]?.delta?.content || "");
//     }   
//   }
}
