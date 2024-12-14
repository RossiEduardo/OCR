import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@services/upload.service';

// @UseGuards(AuthGuard) 
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Intercepta o arquivo enviado no campo "file"
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.uploadService.uploadFile(file);
    return {
      message: 'Arquivo enviado com sucesso',
      fileUrl,
    };
  }
}
