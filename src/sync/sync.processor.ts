import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CacheService } from '../cache/cache.service';
import { DealsService } from '../deals/deals.service';
import { mapExternalLeadToDealInput } from '../integrations/amocrm/amocrm-lead.mapper';
import { AmoCrmProviderService } from '../integrations/amocrm/amocrm-provider.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { PrismaService } from '../prisma/prisma.service';
import { SYNC_QUEUE, SyncJobPayload } from './sync.constants';

@Processor(SYNC_QUEUE)
export class SyncProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly integrations: IntegrationsService,
    private readonly amoCrm: AmoCrmProviderService,
    private readonly deals: DealsService,
    private readonly cache: CacheService,
  ) {
    super();
  }

  async process(job: Job<SyncJobPayload>): Promise<void> {
    const { jobId, userId } = job.data;
    this.logger.log(`Sync job started jobId=${jobId} userId=${userId}`);

    await this.prisma.syncJob.update({
      where: { id: jobId },
      data: { status: 'running', startedAt: new Date(), error: null },
    });

    try {
      const credentials = await this.integrations.getAmoCredentials(userId);
      const tokens = await this.amoCrm.refreshTokensIfNeeded(
        credentials as unknown as Record<string, unknown>,
      );

      const pageSize = 50;
      let page = 1;
      let processed = 0;
      let total = 0;

      while (true) {
        const leads = await this.amoCrm.fetchLeads({
          userId,
          page,
          limit: pageSize,
          credentials: credentials as unknown as Record<string, unknown>,
        });

        if (page === 1 && leads.length === 0) {
          total = 0;
          break;
        }

        if (page === 1) {
          total = leads.length < pageSize ? leads.length : leads.length;
        }

        for (const lead of leads) {
          await this.deals.upsertFromExternal(
            userId,
            mapExternalLeadToDealInput(lead),
          );
          processed += 1;
        }

        await this.prisma.syncJob.update({
          where: { id: jobId },
          data: {
            progress: processed,
            total: processed,
          },
        });

        if (leads.length < pageSize) {
          break;
        }

        page += 1;
      }

      await this.prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          progress: processed,
          total: processed,
          completedAt: new Date(),
        },
      });

      await this.cache.invalidateUserLeadsCache(userId);
      this.logger.log(`Sync job completed jobId=${jobId} processed=${processed}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed';
      await this.prisma.syncJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          error: message,
          completedAt: new Date(),
        },
      });
      this.logger.error(`Sync job failed jobId=${jobId}: ${message}`);
      throw error;
    }
  }
}
