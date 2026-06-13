import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../../src/app.module';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';
import { App } from 'supertest/types';

export async function createTestApp(): Promise<INestApplication<App>> {
  process.env.NODE_ENV = 'test';
  process.env.AMOCRM_MOCK = 'true';
  process.env.LOKI_ENABLED = 'false';
  process.env.DATABASE_URL ??=
    'postgresql://crmforge:crmforge@localhost:5432/crmforge';

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  await app.init();
  return app;
}
