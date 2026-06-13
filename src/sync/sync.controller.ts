import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, JoiValidationPipe } from '../common';
import { JwtPayload } from '../common/interfaces';
import { triggerSyncSchema } from './schemas';
import { SyncService } from './sync.service';

@ApiTags('sync')
@ApiBearerAuth()
@Controller('sync')
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('amocrm/leads')
  @ApiOperation({ summary: 'Trigger amoCRM leads sync' })
  triggerAmoCrmLeads(
    @CurrentUser() user: JwtPayload,
    @Body(new JoiValidationPipe(triggerSyncSchema)) _body: { full: boolean },
  ) {
    return this.sync.triggerAmoCrmLeadsSync(user.sub);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'List sync jobs' })
  listJobs(@CurrentUser() user: JwtPayload) {
    return this.sync.listJobs(user.sub);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get sync job status' })
  getJob(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.sync.getJob(user.sub, id);
  }
}
