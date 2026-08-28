import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CacheService } from './cache/cache.service';
import { httpSecurityMiddleware } from './common/security/http-security.middleware';
import { MetricsService } from './observability/metrics.service';
import { metricsMiddleware } from './observability/metrics.middleware';
import pinoHttp from 'pino-http';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const config = app.get(ConfigService);
  app.use(
    pinoHttp({
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      quietReqLogger: true,
    }),
  );
  app.use(metricsMiddleware(app.get(MetricsService)));
  app.use(
    httpSecurityMiddleware(
      app.get(CacheService),
      config.getOrThrow<number>('RATE_LIMIT_PER_MINUTE'),
    ),
  );
  app.enableCors({ origin: config.getOrThrow<string>('WEB_ORIGIN'), methods: ['GET', 'POST'] });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  await app.listen(config.getOrThrow<number>('PORT'), '0.0.0.0');
}
void bootstrap();
