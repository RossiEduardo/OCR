import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  });

  app.use('/uploads', express.static(uploadsPath));

  await app.listen(process.env.PORT ?? 3000, () => {console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`, uploadsPath)});
}
bootstrap();
