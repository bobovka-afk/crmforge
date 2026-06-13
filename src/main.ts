import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const logger = app.get(Logger);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const apiPrefix = config.get<string>('API_PREFIX', 'api');
  const corsOrigin = config.get<string>('CORS_ORIGIN', 'http://localhost:5173');

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CRMForge API')
    .setDescription('CRM integrator — amoCRM, auth, deals, sync')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);

  logger.log(`API:     http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
