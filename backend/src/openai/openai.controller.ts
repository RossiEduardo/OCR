import { Controller, Post, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { DocumentsService } from '@services/documents.service';

@Controller('openai')
export class OpenaiController {
    constructor(
        private readonly openaiService: OpenaiService,
        private readonly documentsService: DocumentsService
    ) {}
    
    @Get('')
    async generateExplanation(filename: string): Promise<{content: string}> {
        let text = await this.documentsService.getExtractedText(filename);
        let content = await this.openaiService.generateExplanation(text);

        return {content: content};
    }


}
