import { Controller, Post, Get, HttpException, HttpStatus, Query, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { LLMComentsService } from '@services/LLMComents.service';
import { DocumentsService } from '@services/documents.service';
import { LLMChatDto } from 'src/dtos/LLMComents.dto';

@Controller('llm')
export class LLMComentsController {
    constructor(
        private readonly llmComentsService: LLMComentsService,
        private readonly documentsService: DocumentsService
    ) {}
    
    // @Get('generate-comments')
    // async generateLLMComents(@Query('filename') filename: string): Promise<{filename: string, chatResponse: string}> {
    //     if (!filename) {
    //         throw new HttpException(
    //             { status: HttpStatus.BAD_REQUEST, error: 'filename must be provided' },
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    //     // get the content extracted from the document
    //     let text = await this.documentsService.getExtractedText(filename);

    //     const document = await this.documentsService.getDocumentByFilename(filename);

    //     // now llm make the comments
    //     let content = await this.llmComentsService.generateLLMComents(document.id, text);

    //     return {filename: filename, chatResponse: content};
    // }

    @Post('chat')
    async makeQuestion(@Body() body: LLMChatDto, @Res() res: Response){
        if (!body.document_id) {
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'id must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        try{
            // get the content extracted from the document
            let text = await this.documentsService.getExtractedText(body.document_id);

            const document = await this.documentsService.getDocumentById(body.document_id);

            // now llm make the comments
            let content = await this.llmComentsService.makeQuestion(document.id, text, body.question);
            return res.status(200).json({
                success: true,
                role: "AI",
                content: content
            });
            
        }
        catch(error){
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    @Get('get-chat-history')
    async getAllComments(@Query('documentId') documentId: string, @Res() res: Response) {
        if (!documentId) {
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'documentId must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        try{
            const data = await this.llmComentsService.getLLMComentsByDocumentId(documentId);
            return res.status(200).json({
                success: true,
                data: data,
            });
        }
        catch(error){
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
}
