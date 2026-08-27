import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const config = app.get(ConfigService);
  app.enableCors({ origin: config.getOrThrow<string>('WEB_ORIGIN'), methods: ['GET', 'POST'] });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  await app.listen(config.getOrThrow<number>('PORT'), '0.0.0.0');
}
void bootstrap();
