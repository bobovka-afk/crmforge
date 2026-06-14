import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createTestApp } from './helpers/create-test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const email = `test-${Date.now()}@example.com`;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('register → login without verify → verify later', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password: 'password123', name: 'Test', locale: 'ru' })
      .expect(201);

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user?.emailVerified).toBe(false);
    expect(user?.emailVerificationToken).toBeTruthy();

    const loginBeforeVerify = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'password123' })
      .expect(201);

    expect(loginBeforeVerify.body.accessToken).toBeDefined();
    expect(loginBeforeVerify.body.user.emailVerified).toBe(false);

    await request(app.getHttpServer())
      .get('/api/auth/verify-email')
      .query({ token: user!.emailVerificationToken })
      .expect(200);

    const loginAfterVerify = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'password123' })
      .expect(201);

    expect(loginAfterVerify.body.user.emailVerified).toBe(true);
  });
});
