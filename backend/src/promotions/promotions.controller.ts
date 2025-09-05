import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { 
  CreatePromotionDto, 
  UpdatePromotionDto, 
  PromotionResponseDto, 
  ChangePromotionStatusDto,
  PromotionListResponseDto 
} from '../dto';
import { PromotionAuth, AdminAuth, StoreOrAdminAuth } from '../common/security';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ListRequestDto } from '../common/dto/list.dto';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new points-based promotion (Store Owner/Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Promotion created successfully',
    type: PromotionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid promotion data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Store access required' })
  async create(
    @Body() createPromotionDto: CreatePromotionDto,
    @CurrentUser() user: any
  ): Promise<PromotionResponseDto> {
    return this.promotionsService.create(createPromotionDto, user);
  }

  @Get()
  @StoreOrAdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promotions with pagination and filtering' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of promotions with pagination',
    type: PromotionListResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  async findAll(
    @Query() query: any,
    @CurrentUser() user: any
  ): Promise<any> {
    const request: ListRequestDto = {
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
      search: query.search,
      searchFields: query.searchFields ? query.searchFields.split(',') : ['title', 'description'],
      sort: query.sort ? JSON.parse(query.sort) : [],
      filters: query.filters ? JSON.parse(query.filters) : {}
    };

    const additionalFilters: any = {
      requestingUser: user
    };

    return this.promotionsService.findAll(request, additionalFilters);
  }

  @Get('stats')
  @StoreOrAdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promotion statistics (Store/Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promotion statistics',
    type: Object 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Store/Admin access required' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID (Admin only)' })
  async getStats(
    @Query('storeId') storeId?: string,
    @CurrentUser() user?: any
  ): Promise<{
    total: number;
    active: number;
    inactive: number;
    expired: number;
    deleted: number;
  }> {
    return this.promotionsService.getPromotionStats(storeId, user);
  }

  @Get('store/:storeId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promotions by store ID' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of promotions for the store',
    type: [PromotionResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  async findByStore(
    @Param('storeId') storeId: string,
    @Query('status') status?: string
  ): Promise<PromotionResponseDto[]> {
    return this.promotionsService.findByStore(storeId, status);
  }

  @Get(':id')
  @PromotionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promotion by ID (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promotion found',
    type: PromotionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<PromotionResponseDto> {
    return this.promotionsService.findOne(id, user);
  }

  @Get(':id/with-codes')
  @PromotionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promotion by ID with promo code count (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promotion found with code count',
    type: PromotionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findOneWithCodeCount(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<PromotionResponseDto & { promoCodeCount: number }> {
    return this.promotionsService.getPromotionWithCodeCount(id, user);
  }

  @Patch(':id')
  @PromotionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promotion information (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promotion updated successfully',
    type: PromotionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @CurrentUser() user: any
  ): Promise<PromotionResponseDto> {
    return this.promotionsService.update(id, updatePromotionDto, user);
  }

  @Patch(':id/status')
  @PromotionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change promotion status (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promotion status updated successfully',
    type: PromotionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangePromotionStatusDto,
    @CurrentUser() user: any
  ): Promise<PromotionResponseDto> {
    return this.promotionsService.changeStatus(id, changeStatusDto, user);
  }

  @Delete(':id')
  @PromotionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promotion (soft delete) (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ status: 200, description: 'Promotion deleted successfully' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.promotionsService.remove(id, user);
  }
}
