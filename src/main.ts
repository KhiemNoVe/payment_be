import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app';
import { setupSwagger } from './utils';

async function bootstrap() {
  const configService = new ConfigService();
  const port = configService.get<number>('SERVER_PORT') || 8000;

  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  //Setup
  setupSwagger(app);

  await app.listen(port, () => {
    Logger.log(`🚀 Server on http://localhost:${port}/docs`);
  });
}
bootstrap();
