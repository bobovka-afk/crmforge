import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../../src/prisma/prisma.service';
import { loginTestUser, waitForSyncJob } from './helpers/auth.helper';
import { createTestApp } from './helpers/create-test-app';

describe('Integrations (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;
  const email = `integrations-${Date.now()}@example.com`;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    accessToken = await loginTestUser(app, email);
  });

  afterAll(async () => {
    await prisma.integration.deleteMany({
      where: { user: { email } },
    });
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('connects amoCRM in mock mode and returns status', async () => {
    await request(app.getHttpServer())
      .post('/api/integrations/amocrm/connect')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ subdomain: 'demo' })
      .expect(201);

    const status = await request(app.getHttpServer())
      .get('/api/integrations/amocrm')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(status.body.connected).toBe(true);
    expect(status.body.subdomain).toBe('demo');

    const test = await request(app.getHttpServer())
      .post('/api/integrations/amocrm/test')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(test.body.ok).toBe(true);
  });
});

describe('Deals (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;
  const email = `deals-${Date.now()}@example.com`;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    accessToken = await loginTestUser(app, email);

    await request(app.getHttpServer())
      .post('/api/integrations/amocrm/connect')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ subdomain: 'demo' })
      .expect(201);
  });

  afterAll(async () => {
    await prisma.deal.deleteMany({ where: { user: { email } } });
    await prisma.syncJob.deleteMany({ where: { user: { email } } });
    await prisma.integration.deleteMany({ where: { user: { email } } });
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('syncs mock leads and lists deals', async () => {
    const trigger = await request(app.getHttpServer())
      .post('/api/sync/amocrm/leads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ full: true })
      .expect(201);

    const jobId = trigger.body.data.id as string;
    const job = await waitForSyncJob(app, accessToken, jobId);
    expect(job.status).toBe('completed');
    expect(job.progress).toBeGreaterThan(0);

    const deals = await request(app.getHttpServer())
      .get('/api/deals?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(deals.body.meta.total).toBeGreaterThan(0);
    expect(deals.body.data.length).toBeGreaterThan(0);
  });

  it('creates, updates and soft-deletes a local deal', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/deals')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Local deal',
        status: 'new',
        amount: 1000,
      })
      .expect(201);

    const dealId = created.body.data.id as string;

    await request(app.getHttpServer())
      .patch(`/api/deals/${dealId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'won' })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/deals/${dealId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/deals/${dealId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
