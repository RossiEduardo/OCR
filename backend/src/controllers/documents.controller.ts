import { Res, Get, Post, Query, Controller, UseGuards, UseInterceptors, UploadedFile, Body, HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { DocumentsService } from "@services/documents.service";
import { DocumentsDto } from "src/dtos/documents.dto";
import { UploadService } from "@services/upload.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@UseGuards(AuthGuard) // Need to be authenticated to access these routes
@Controller('documents')
export class DocumentsController{
    constructor(
        private readonly documentsService: DocumentsService,
        private readonly uploadService: UploadService,
    ) {}
    
    @Get('user-documents')
    async getUserDocuments(@Query('userId') userId: string, @Res() res: Response) {
        if (!userId) {
            throw new HttpException(
              { status: HttpStatus.BAD_REQUEST, error: 'userId must be provided' },
              HttpStatus.BAD_REQUEST,
            );
        }
        try{
            return res.status(200).json({
                success: true,
                data: await this.documentsService.getUserDocuments(userId),
            });
        }
        catch(error){
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    
    @Get('extracted-text')
    async getExtractedText(@Query('filename') filename: string): Promise<{filename: string, content: string}> {
        if (!filename) {
            throw new HttpException(
              { status: HttpStatus.BAD_REQUEST, error: 'filename must be provided' },
              HttpStatus.BAD_REQUEST,
            );
        }
        let result = {
            filename: filename,
            content: await this.documentsService.getExtractedText(filename),
        }
        return result;
    }

    @Post('upload')
      @UseInterceptors(FileInterceptor('file')) // Intercepta o arquivo enviado no campo "file"
      async uploadDocument(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        if(!file || !body.userId){
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'File and userId must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.uploadService.uploadFile(file, body.userId);   
    }

    @Get('get')
    async getDocumentById(@Query('filename') documentFilename: string, @Res() res: Response) {
        if (!documentFilename) {
            throw new HttpException(
              { status: HttpStatus.BAD_REQUEST, error: 'document filename must be provided' },
              HttpStatus.BAD_REQUEST,
            );
        }
        try{
            return res.status(200).json({
                success: true,
                data: await this.documentsService.getDocumentByFilename(documentFilename),
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