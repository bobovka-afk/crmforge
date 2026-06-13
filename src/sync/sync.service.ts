import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { AppErrors } from '../common/errors';
import { PrismaService } from '../prisma/prisma.service';
import {
  SYNC_JOB_TYPES,
  SYNC_QUEUE,
  SyncJobPayload,
} from './sync.constants';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(SYNC_QUEUE) private readonly syncQueue: Queue<SyncJobPayload>,
  ) {}

  async triggerAmoCrmLeadsSync(userId: string) {
    const job = await this.prisma.syncJob.create({
      data: {
        userId,
        provider: 'amocrm',
        type: SYNC_JOB_TYPES.AMOCRM_LEADS,
        status: 'queued',
      },
    });

    await this.syncQueue.add(
      SYNC_JOB_TYPES.AMOCRM_LEADS,
      {
        jobId: job.id,
        userId,
        provider: 'amocrm',
        type: SYNC_JOB_TYPES.AMOCRM_LEADS,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );

    this.logger.log(`Queued amoCRM leads sync jobId=${job.id} userId=${userId}`);

    return { data: job };
  }

  async listJobs(userId: string) {
    const jobs = await this.prisma.syncJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { data: jobs };
  }

  async getJob(userId: string, id: string) {
    const job = await this.prisma.syncJob.findFirst({
      where: { id, userId },
    });

    if (!job) {
      throw new NotFoundException(AppErrors.SYNC_JOB_NOT_FOUND);
    }

    return { data: job };
  }
}
