import { Injectable } from '@nestjs/common';
import { IUploadRepository } from './interfaces/upload-repository.interface';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, normalize } from 'path';

@Injectable()
export class LocalUploadRepository implements IUploadRepository {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Use process.cwd() para obter o diretório de trabalho atual do Node.js
    const uploadPath = join(process.cwd(), 'uploads');


    // Verifica se o diretório de upload existe, se não, cria-o
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = join(uploadPath, file.originalname);

    // Salva o arquivo no diretório de upload
    writeFileSync(filePath, file.buffer);

    return normalize(filePath);
  }
}