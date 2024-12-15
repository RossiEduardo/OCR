import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  });
  await app.listen(process.env.PORT ?? 3000, () => {console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`)});
}
bootstrap();
