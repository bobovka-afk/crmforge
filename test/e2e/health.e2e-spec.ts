import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './helpers/create-test-app';

describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('GET /api/health/ready', () => {
    return request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('checks.database');
        expect(res.body).toHaveProperty('checks.redis');
      });
  });
});
