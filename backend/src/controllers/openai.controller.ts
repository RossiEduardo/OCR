import { Controller, Post, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { OpenaiService } from '../application/services/openai.service';
import { DocumentsService } from '@services/documents.service';

@Controller('openai')
export class OpenaiController {
    constructor(
        private readonly openaiService: OpenaiService,
        private readonly documentsService: DocumentsService
    ) {}
    
    @Get('generate-explanation')
    async generateExplanation(@Query('filename') filename: string): Promise<{content: string}> {
        if (!filename) {
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'filename must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        let text = await this.documentsService.getExtractedText(filename);
        let content = await this.openaiService.generateExplanation(text);

        return {content: content};
    }


}
