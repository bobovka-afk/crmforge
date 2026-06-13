import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../../../src/prisma/prisma.service';

export async function loginTestUser(
  app: INestApplication<App>,
  email: string,
  password = 'password123',
): Promise<string> {
  const prisma = app.get(PrismaService);

  await request(app.getHttpServer())
    .post('/api/auth/register')
    .send({ email, password })
    .expect(201);

  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  const login = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password })
    .expect(201);

  return login.body.accessToken as string;
}

export async function waitForSyncJob(
  app: INestApplication<App>,
  accessToken: string,
  jobId: string,
  timeoutMs = 15000,
): Promise<{ status: string; progress: number }> {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const response = await request(app.getHttpServer())
      .get(`/api/sync/jobs/${jobId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const job = response.body.data;
    if (job.status === 'completed') {
      return job;
    }
    if (job.status === 'failed') {
      throw new Error(job.error ?? 'Sync failed');
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error('Sync job timeout');
}
