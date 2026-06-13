import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DealsService } from '../../../src/deals/deals.service';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('DealsService', () => {
  let service: DealsService;
  const prisma = {
    deal: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(DealsService);
  });

  it('lists deals with pagination meta', async () => {
    prisma.deal.count.mockResolvedValue(1);
    prisma.deal.findMany.mockResolvedValue([{ id: 'd1', title: 'Deal' }]);

    const result = await service.list('user-1', {
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'desc',
    });

    expect(result.meta.total).toBe(1);
    expect(result.data).toHaveLength(1);
  });

  it('throws when deal not found', async () => {
    prisma.deal.findFirst.mockResolvedValue(null);

    await expect(service.getById('user-1', 'missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
