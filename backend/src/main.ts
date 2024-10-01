import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.APPLICATION_PORT ?? 9009;
  const app = await NestFactory.create(AppModule);
  console.log('Listening on port ' + port);
  await app.listen(port);
}

bootstrap();
