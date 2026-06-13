import { Module } from '@nestjs/common';
import { AmoCrmClient } from './amocrm/amocrm.client';
import { AmoCrmOAuthService } from './amocrm/amocrm-oauth.service';
import { AmoCrmProviderService } from './amocrm/amocrm-provider.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    AmoCrmProviderService,
    AmoCrmClient,
    AmoCrmOAuthService,
  ],
  exports: [IntegrationsService, AmoCrmProviderService],
})
export class IntegrationsModule {}
