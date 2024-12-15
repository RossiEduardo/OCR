import { Controller, Post, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { LLMComentsService } from '@services/LLMComents.service';
import { DocumentsService } from '@services/documents.service';

@Controller('llm-coments')
export class LLMComentsController {
    constructor(
        private readonly llmComentsService: LLMComentsService,
        private readonly documentsService: DocumentsService
    ) {}
    
    @Get('generate-explanation')
    async generateExplanation(@Query('filename') filename: string): Promise<{filename: string, content: string}> {
        if (!filename) {
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'filename must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        let text = await this.documentsService.getExtractedText(filename);

        const document = await this.documentsService.getDocumentByFilename(filename);

        let content = await this.llmComentsService.generateExplanation(document.id, text);

        return {filename: filename, content: content};
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
