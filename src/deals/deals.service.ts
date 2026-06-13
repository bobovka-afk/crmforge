import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppErrors } from '../common/errors';
import { PaginatedResponse } from '../common/interfaces';
import { PrismaService } from '../prisma/prisma.service';

export interface ListDealsQuery {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  sort: 'createdAt' | 'amount' | 'syncedAt';
  order: 'asc' | 'desc';
}

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, query: ListDealsQuery): Promise<PaginatedResponse<unknown>> {
    const where: Prisma.DealWhereInput = {
      userId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { contactName: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      this.prisma.deal.count({ where }),
      this.prisma.deal.findMany({
        where,
        orderBy: { [query.sort]: query.order },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return {
      data,
      meta: { page: query.page, limit: query.limit, total },
    };
  }

  async getById(userId: string, id: string) {
    const deal = await this.prisma.deal.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!deal) {
      throw new NotFoundException(AppErrors.DEAL_NOT_FOUND);
    }

    return { data: deal };
  }

  async create(
    userId: string,
    input: {
      title: string;
      amount?: number;
      currency?: string;
      status: string;
      stage?: string;
      contactName?: string;
    },
  ) {
    const deal = await this.prisma.deal.create({
      data: {
        userId,
        title: input.title,
        amount: input.amount,
        currency: input.currency ?? 'RUB',
        status: input.status,
        stage: input.stage,
        contactName: input.contactName,
      },
    });

    return { data: deal };
  }

  async update(
    userId: string,
    id: string,
    input: {
      title?: string;
      amount?: number;
      currency?: string;
      status?: string;
      stage?: string;
      contactName?: string;
    },
  ) {
    await this.getById(userId, id);

    const deal = await this.prisma.deal.update({
      where: { id },
      data: input,
    });

    return { data: deal };
  }

  async softDelete(userId: string, id: string) {
    await this.getById(userId, id);

    await this.prisma.deal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async upsertFromExternal(
    userId: string,
    input: {
      externalId: string;
      title: string;
      amount?: number;
      currency?: string;
      status: string;
      stage?: string;
      contactName?: string;
      rawPayload?: Record<string, unknown>;
    },
  ) {
    return this.prisma.deal.upsert({
      where: {
        userId_externalId: { userId, externalId: input.externalId },
      },
      create: {
        userId,
        externalId: input.externalId,
        title: input.title,
        amount: input.amount,
        currency: input.currency ?? 'RUB',
        status: input.status,
        stage: input.stage,
        contactName: input.contactName,
        rawPayload: input.rawPayload as Prisma.InputJsonValue | undefined,
        syncedAt: new Date(),
      },
      update: {
        title: input.title,
        amount: input.amount,
        currency: input.currency ?? 'RUB',
        status: input.status,
        stage: input.stage,
        contactName: input.contactName,
        rawPayload: input.rawPayload as Prisma.InputJsonValue | undefined,
        syncedAt: new Date(),
        deletedAt: null,
      },
    });
  }
}
