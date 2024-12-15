import { Injectable } from '@nestjs/common';
import { IUploadRepository } from './interfaces/upload-repository.interface';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, normalize } from 'path';

@Injectable()
export class LocalUploadRepository implements IUploadRepository {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Get the path of the uploads directory
    const uploadPath = join(process.cwd(), 'uploads');

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = join(uploadPath, file.originalname);

    // Save the file to the upload directory
    writeFileSync(filePath, file.buffer);

    return normalize(filePath);
  }
}