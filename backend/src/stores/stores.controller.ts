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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto, CreateStoreWithUserDto, StoreWithUserResponseDto } from '../dto';
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all stores (Public read, Admin full access)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all stores',
    type: [StoreResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<StoreResponseDto[]> {
    const result = await this.storesService.findAll({ page: 1, limit: 100 }, {});
    return result.data.map(store => ({
      id: store._id.toString(),
      name: store.name,
      ownerName: store.ownerName,
      phoneNumber: store.phoneNumber,
      userId: store.userId.toString(),
      address: store.address,
      loyaltySettings: store.loyaltySettings,
      plan: store.plan,
      role: store.role,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt
    }));
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
}
