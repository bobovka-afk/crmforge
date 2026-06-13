import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JoiValidationPipe } from '../common';
import { JwtPayload } from '../common/interfaces';
import { DealsService } from './deals.service';
import {
  createDealSchema,
  listDealsSchema,
  updateDealSchema,
} from './schemas';

@ApiTags('deals')
@ApiBearerAuth()
@Controller('deals')
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Get()
  @ApiOperation({ summary: 'List deals with pagination and filters' })
  list(
    @CurrentUser() user: JwtPayload,
    @Query(new JoiValidationPipe(listDealsSchema))
    query: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
      sort: 'createdAt' | 'amount' | 'syncedAt';
      order: 'asc' | 'desc';
    },
  ) {
    return this.deals.list(user.sub, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by id' })
  getById(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.deals.getById(user.sub, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create local deal' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body(new JoiValidationPipe(createDealSchema))
    body: {
      title: string;
      amount?: number;
      currency?: string;
      status: string;
      stage?: string;
      contactName?: string;
    },
  ) {
    return this.deals.create(user.sub, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deal' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateDealSchema))
    body: {
      title?: string;
      amount?: number;
      currency?: string;
      status?: string;
      stage?: string;
      contactName?: string;
    },
  ) {
    return this.deals.update(user.sub, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete deal' })
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.deals.softDelete(user.sub, id);
    return { message: 'Deal deleted' };
  }
}
