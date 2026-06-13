import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DealsModule } from '../deals/deals.module';
import { IntegrationsModule } from '../integrations/integrations.module';
import { SYNC_QUEUE } from './sync.constants';
import { SyncController } from './sync.controller';
import { SyncProcessor } from './sync.processor';
import { SyncService } from './sync.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue({ name: SYNC_QUEUE }),
    IntegrationsModule,
    DealsModule,
  ],
  controllers: [SyncController],
  providers: [SyncService, SyncProcessor],
  exports: [SyncService],
})
export class SyncModule {}
