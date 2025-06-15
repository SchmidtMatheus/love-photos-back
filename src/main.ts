import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dotenv = require('dotenv');
  dotenv.config();
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
