import { getQueueToken } from '@nestjs/bullmq';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { SYNC_QUEUE } from '../../../src/sync/sync.constants';
import { SyncService } from '../../../src/sync/sync.service';

describe('SyncService', () => {
  let service: SyncService;
  const prisma = {
    syncJob: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  const queue = { add: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: PrismaService, useValue: prisma },
        { provide: getQueueToken(SYNC_QUEUE), useValue: queue },
      ],
    }).compile();

    service = module.get(SyncService);
  });

  it('queues amoCRM leads sync job', async () => {
    prisma.syncJob.create.mockResolvedValue({
      id: 'job-1',
      status: 'queued',
      provider: 'amocrm',
    });

    const result = await service.triggerAmoCrmLeadsSync('user-1');

    expect(queue.add).toHaveBeenCalled();
    expect(result.data.id).toBe('job-1');
  });

  it('throws when sync job not found', async () => {
    prisma.syncJob.findFirst.mockResolvedValue(null);

    await expect(service.getJob('user-1', 'missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
