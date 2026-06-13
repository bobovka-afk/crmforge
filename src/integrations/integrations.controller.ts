import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser, JoiValidationPipe, Public } from '../common';
import { JwtPayload } from '../common/interfaces';
import {
  connectAmoCrmSchema,
  oauthCallbackQuerySchema,
} from './amocrm/schemas';
import { IntegrationsService } from './integrations.service';

@ApiTags('integrations')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'List user integrations' })
  list(@CurrentUser() user: JwtPayload) {
    return this.integrations.list(user.sub);
  }

  @Get('amocrm')
  @ApiOperation({ summary: 'amoCRM integration status' })
  getAmoCrm(@CurrentUser() user: JwtPayload) {
    return this.integrations.getAmoCrmStatus(user.sub);
  }

  @Get(':provider')
  @ApiOperation({ summary: 'Integration status by provider' })
  getByProvider(
    @CurrentUser() user: JwtPayload,
    @Param('provider') provider: string,
  ) {
    if (provider !== 'amocrm') {
      return { connected: false, provider, status: 'unsupported' };
    }
    return this.integrations.getAmoCrmStatus(user.sub);
  }

  @Get('amocrm/oauth/url')
  @ApiOperation({ summary: 'OAuth authorize URL' })
  getOAuthUrl(@CurrentUser() user: JwtPayload) {
    return this.integrations.getOAuthUrl(user.sub);
  }

  @Public()
  @Get('amocrm/oauth/callback')
  @ApiOperation({ summary: 'OAuth callback' })
  async oauthCallback(
    @Query(new JoiValidationPipe(oauthCallbackQuerySchema))
    query: { code: string; state: string; referer?: string },
    @Res() res: Response,
  ) {
    const result = await this.integrations.handleOAuthCallback(
      query.code,
      query.state,
      query.referer,
    );
    res.redirect(result.redirectUrl);
  }

  @Post('amocrm/connect')
  @ApiOperation({ summary: 'Connect amoCRM (mock or manual)' })
  connect(
    @CurrentUser() user: JwtPayload,
    @Body(new JoiValidationPipe(connectAmoCrmSchema))
    body: { subdomain: string; clientId?: string; clientSecret?: string },
  ) {
    return this.integrations.connectAmoCrm(user.sub, body);
  }

  @Post('amocrm/test')
  @ApiOperation({ summary: 'Test amoCRM connection' })
  test(@CurrentUser() user: JwtPayload) {
    return this.integrations.testAmoCrm(user.sub);
  }

  @Delete('amocrm')
  @ApiOperation({ summary: 'Disconnect amoCRM' })
  disconnect(@CurrentUser() user: JwtPayload) {
    return this.integrations.disconnectAmoCrm(user.sub);
  }
}
