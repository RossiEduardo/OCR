import { Controller, Post, Get, HttpException, HttpStatus, Query, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LLMComentsService } from '@services/LLMComents.service';
import { DocumentsService } from '@services/documents.service';
import { LLMChatDto } from 'src/dtos/LLMComents.dto';
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard) // Need to be authenticated to access these routes
@Controller('llm')
export class LLMComentsController {
    constructor(
        private readonly llmComentsService: LLMComentsService,
        private readonly documentsService: DocumentsService
    ) {}

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


