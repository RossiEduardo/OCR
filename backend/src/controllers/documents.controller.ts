import { Request, Get, Post, Query, Controller, UseGuards, UseInterceptors, UploadedFile, Body, HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { DocumentsService } from "@services/documents.service";
import { DocumentsDto } from "src/dtos/documents.dto";
import { UploadService } from "@services/upload.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from "@services/user.service";

// @UseGuards(AuthGuard)
@Controller('documents')
export class DocumentsController{
    constructor(
        private readonly documentsService: DocumentsService,
        private readonly uploadService: UploadService,
        private readonly userService: UserService
    ) {}
    
    @Get('user-documents')
    async getUserDocuments(@Query('userEmail') email: string): Promise<{ success: boolean; data: DocumentsDto[] }> {
        if (!email) {
            throw new HttpException(
              { status: HttpStatus.BAD_REQUEST, error: 'Email must be provided' },
              HttpStatus.BAD_REQUEST,
            );
        }
        let data = await this.documentsService.getUserDocuments(email);
        if (data.length === 0) {
            throw new HttpException(
              { status: HttpStatus.NOT_FOUND, error: 'No documents found for the given user email' },
              HttpStatus.NOT_FOUND,
            );
        }
        let response = {
            success: true,
            data: await this.documentsService.getUserDocuments(email),
        }
        return response;
    }
    
    @Get('extracted-text')
    async getExtractedText(@Query('documentId') documentId: string): Promise<string> {
        return await this.documentsService.getExtractedText(documentId);
    }

    @Post('upload')
      @UseInterceptors(FileInterceptor('file')) // Intercepta o arquivo enviado no campo "file"
      async uploadDocument(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        if(!file || !body.email){
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'File and email must be provided' },
                HttpStatus.BAD_REQUEST,
            );
        }
        //Upload no servidor
        try{
            const filePath = await this.uploadService.uploadFile(file);
            const user = await this.userService.findUser(body.email);

            //salvar no banco de dados
            await this.documentsService.saveDocument({
                filename: file.originalname,
                filepath: filePath,
                user_id: user.id
            });
            return { message: 'Documento salvo com sucesso' };
        }
        catch (error) {
            if (error.message === 'existingDocument') {
              // Retorna erro 400
              throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: 'This document has already been uploaded' },
                HttpStatus.BAD_REQUEST,
              );
            }
            // Outro erro (500 Internal Server Error)
            throw new HttpException(
              { status: HttpStatus.INTERNAL_SERVER_ERROR, error:`An error occurred while saving the document: ${error.message}` },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}