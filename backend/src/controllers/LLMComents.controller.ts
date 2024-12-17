import { Controller, Post, Get, HttpException, HttpStatus, Query, Body } from '@nestjs/common';
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
    async makeQuestion(@Body() body: LLMChatDto): Promise<{chatResponse: string}> {
        if (!body.filename) {
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'filename must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        console.log(body);
        console.log(body.filename);
        // get the content extracted from the document
        let text = await this.documentsService.getExtractedText(body.filename);

        const document = await this.documentsService.getDocumentByFilename(body.filename);

        // now llm make the comments
        let content = await this.llmComentsService.makeQuestion(document.id, text, body.question);

        return {chatResponse: content};
    }

    @Get('get-all-comments-by-filename')
    async getAllComments(@Query('filename') filename: string): Promise<any[]> {
        if (!filename) {
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'filename must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.llmComentsService.getLLMComentsByFilename(filename);
    }
}
