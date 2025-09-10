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
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StoresService, StoreStats } from './stores.service';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreSelfDto, StoreResponseDto, CreateStoreWithUserDto, StoreWithUserResponseDto, SendSmsToCustomerDto, UpdateSmsBalanceDto } from '../dto';
import { ListRequestDto } from '../common/dto/list.dto';
import { StoreAuth, AdminAuth } from '../common/security';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new store (Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Store created successfully',
    type: StoreResponseDto 
  })
  @ApiResponse({ status: 409, description: 'Store with this phone number already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async create(@Body() createStoreDto: CreateStoreDto): Promise<StoreResponseDto> {
    return this.storesService.create(createStoreDto);
  }

  @Post('with-user')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new store with user (Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Store created successfully with user',
    type: StoreWithUserResponseDto 
  })
  @ApiResponse({ status: 409, description: 'Store with this phone number already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createStoreWithUser(@Body() createStoreWithUserDto: CreateStoreWithUserDto): Promise<StoreWithUserResponseDto> {
    return this.storesService.createStoreWithUser(createStoreWithUserDto);
  }

  @Get()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all stores with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of stores with pagination',
    type: Object 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(
    @Query() query: any,
    @CurrentUser() user: any
  ) {
    const request: ListRequestDto = {
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
      search: query.search,
      searchFields: query.searchFields ? query.searchFields.split(',') : ['name', 'phoneNumber'],
      sort: query.sort ? JSON.parse(query.sort) : [],
      filters: query.filters ? JSON.parse(query.filters) : []
    };

    return this.storesService.findAll(request, { requestingUser: user });
  }

  @Get('stats')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store statistics (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Store statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        pending: { type: 'number' },
        inactive: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getStats(): Promise<StoreStats> {
    return this.storesService.getStats();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user store (Store Owner only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current user store found',
    type: StoreResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a store user' })
  async getCurrentStore(@CurrentUser() user: any): Promise<StoreResponseDto> {
    if (user.role !== 'store') {
      throw new ForbiddenException('Only store users can access this endpoint');
    }
    
    if (!user.storeId) {
      throw new NotFoundException('Store not found for this user');
    }
    
    return this.storesService.findOne(user.storeId, user);
  }

  @Patch('me')
  @StoreAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own store information (Store Owner only) - Restricted fields' })
  @ApiResponse({ 
    status: 200, 
    description: 'Store updated successfully',
    type: StoreResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a store user' })
  async updateSelf(
    @Body() updateStoreSelfDto: UpdateStoreSelfDto,
    @CurrentUser() user: any
  ): Promise<StoreResponseDto> {
    return this.storesService.updateSelf(updateStoreSelfDto, user);
  }

  @Get(':id')
  @StoreAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store by ID (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Store found',
    type: StoreResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<StoreResponseDto> {
    return this.storesService.findOne(id, user);
  }

  @Patch(':id')
  @StoreAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store information (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Store updated successfully',
    type: StoreResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @CurrentUser() user: any
  ): Promise<StoreResponseDto> {
    return this.storesService.update(id, updateStoreDto, user);
  }

  @Delete(':id')
  @StoreAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete store (Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'Store deleted successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.storesService.remove(id, user);
  }

  @Patch(':id/sms-balance')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update SMS balance for a store (Admin only)' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'SMS balance updated successfully',
    type: StoreResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateSmsBalance(
    @Param('id') id: string,
    @Body() updateSmsBalanceDto: UpdateSmsBalanceDto,
    @CurrentUser() user: any
  ): Promise<StoreResponseDto> {
    return this.storesService.updateSmsBalance(id, updateSmsBalanceDto.amount, user);
  }

  @Get('sms/stats')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SMS statistics for all stores (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'SMS statistics',
    schema: {
      type: 'object',
      properties: {
        totalBalance: { type: 'number' },
        totalSmsSent: { type: 'number' },
        storesWithBalance: { type: 'number' },
        averageBalance: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getSmsStats() {
    return this.storesService.getSmsStats();
  }

  @Post('me/sms/send-to-customer')
  @StoreAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send SMS to a customer (Store Owner only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'SMS sent successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        providerResponse: { type: 'string' },
        text: { type: 'string' },
        createdBy: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - insufficient balance or invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden - user is not a customer of the store' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendSmsToCustomerFromMyStore(
    @Body() sendSmsToCustomerDto: SendSmsToCustomerDto,
    @CurrentUser() user: any
  ) {
    // For store users, use their storeId from the authenticated user
    if (user.role === 'store') {
      return this.storesService.sendSmsToCustomer(user.storeId, sendSmsToCustomerDto.userId, sendSmsToCustomerDto.text, user);
    }
    throw new ForbiddenException('Only store users can use this endpoint');
  }

  @Post(':id/sms/send-to-customer')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send SMS to a customer (Admin only)' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ 
    status: 201, 
    description: 'SMS sent successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        providerResponse: { type: 'string' },
        text: { type: 'string' },
        createdBy: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - insufficient balance or invalid data' })
  @ApiResponse({ status: 403, description: 'Forbidden - user is not a customer of the store' })
  @ApiResponse({ status: 404, description: 'Store or user not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendSmsToCustomer(
    @Param('id') storeId: string,
    @Body() sendSmsToCustomerDto: SendSmsToCustomerDto,
    @CurrentUser() user: any
  ) {
    return this.storesService.sendSmsToCustomer(storeId, sendSmsToCustomerDto.userId, sendSmsToCustomerDto.text, user);
  }

  @Get('me/sms/history')
  @StoreAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SMS history for current store (Store Owner only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ 
    status: 200, 
    description: 'SMS history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              sentDate: { type: 'string', format: 'date-time' },
              customerName: { type: 'string' },
              customerPhone: { type: 'string' },
              messagePreview: { type: 'string' },
              messageText: { type: 'string' }
            }
          }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
        hasNextPage: { type: 'boolean' },
        hasPrevPage: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not a store user' })
  async getSmsHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() user: any
  ) {
    // For store users, use their storeId from the authenticated user
    if (user.role === 'store') {
      return this.storesService.getSmsHistory(user.storeId, user, page, limit);
    }
    throw new ForbiddenException('Only store users can access SMS history');
  }

  @Get(':id/sms/history')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SMS history for a store (Admin only)' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ 
    status: 200, 
    description: 'SMS history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              sentDate: { type: 'string', format: 'date-time' },
              customerName: { type: 'string' },
              customerPhone: { type: 'string' },
              messagePreview: { type: 'string' },
              messageText: { type: 'string' }
            }
          }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
        hasNextPage: { type: 'boolean' },
        hasPrevPage: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not an admin' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getSmsHistoryForStore(
    @Param('id') storeId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() user: any
  ) {
    return this.storesService.getSmsHistory(storeId, user, page, limit);
  }
}
