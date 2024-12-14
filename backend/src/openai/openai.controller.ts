import { Controller, Post, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(
        private readonly openaiService: OpenaiService,
    ) {}
    
    @Get('')
    async generateExplanation(): Promise<{content: string}> {
        let content = await this.openaiService.generateExplanation();

        return {content: content};
    }


}
