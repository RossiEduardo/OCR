import { Injectable } from '@nestjs/common';
import axios from 'axios';
import OpenAI from "openai";


@Injectable()
export class OpenaiService {
    private readonly openai = new OpenAI({apiKey: process.env.OPEN_AI_SECRET_KEY});
        
    private readonly openaiApiKey = process.env.OPENAI_API_KEY;  // Chave de API OpenAI
    private readonly openaiEndpoint = 'https://api.openai.com/v1/completions';  // Endpoint da API OpenAI

    // Função para gerar explicações sobre o texto
    async generateExplanation(): Promise<string> {
        try {
            let text = "O  Programa,  a  CPG-ICMC  e  o  ICMC-USP  não  se  responsabilizam  pelo  não  preenchimento  da  inscrição  por \nmotivo  de  ordem  técnica  referente  aos  computadores,  falhas  de  comunicação,  congestionamento  das  linhas  de \ncomunicação,  bem  como  outros  fatores  que  impossibilitem  a  transferência  de  dados  e  documentos.  Não  se \nresponsabiliza, ainda, por qualquer tipo de problema ou crime cibernético, que resulte na não efetivação da inscrição. \n7.4. Os  casos  omissos,  isto  é,  que  não  estão  contemplados  neste  documento,  serão  resolvidos  pela  Comissão \nCoordenadora do Programa.";
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
            // const response = await axios.post(
            //     this.openaiEndpoint,
            //     {
            //     model: 'gpt-4',  // Modelo GPT-4, mas pode ser substituído por outro modelo
            //     prompt: `Por favor, explique o seguinte texto:\n\n${text}`,
            //     max_tokens: 150,  // Tamanho da resposta do modelo
            //     temperature: 0.7,  // Controle de criatividade (0 a 1)
            //     },
            //     {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         Authorization: `Bearer ${this.openaiApiKey}`,
            //     },
            //     }
            // );
            // console.log(response.data.choices[0].text.trim()); // Retorna a explicação gerada

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
