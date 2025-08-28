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
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, PurchaseDto, UserResponseDto } from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { UserNotFoundException } from '../common/errors';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserAuth, AdminAuth } from '../common/security';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private transformUserToResponse(user: any): UserResponseDto {
    return {
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      totalPoints: user.totalPoints,
      purchases: user.purchases?.map(purchase => ({
        storeId: purchase.storeId?.toString(),
        amount: purchase.amount,
        date: purchase.date,
        scratchCode: purchase.scratchCode,
        entryMethod: purchase.entryMethod,
        rewardApplied: purchase.rewardApplied ? {
          type: purchase.rewardApplied.type,
          value: purchase.rewardApplied.value
        } : undefined,
      })) || [],

      role: user.role,
      status: user.status || 'active',
      lastActivity: user.lastActivity,
      storeName: user.storeName,
      address: user.address,
      description: user.description,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return this.transformUserToResponse(user);
  }

  @Get()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with pagination, sorting, and filtering (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: ListResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(
    @Query() listRequest: ListRequestDto,
    @CurrentUser() currentUser: any
  ): Promise<ListResponseDto<UserResponseDto>> {
    const response = await this.usersService.findAll(listRequest, { requestingUser: currentUser });
    
    // Transform the response data
    const transformedData = response.data.map(user => this.transformUserToResponse(user));
    
    return {
      ...response,
      data: transformedData
    };
  }

  @Get('filter-options')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available filter options for users (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Filter options retrieved successfully'
  })
  async getFilterOptions() {
    return this.usersService.getFilterOptions();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current user profile',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser() user: any): Promise<UserResponseDto> {
    // Fetch the full user data from the database
    const fullUser = await this.usersService.findByPhoneNumber(user.phoneNumber);
    if (!fullUser) {
      throw new UserNotFoundException();
    }
    return this.transformUserToResponse(fullUser);
  }

  @Get(':id')
  @UserAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (Self/Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<UserResponseDto> {
    const userDoc = await this.usersService.findOne(id, user);
    return this.transformUserToResponse(userDoc);
  }

  @Patch(':id')
  @UserAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user information (Self/Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.update(id, updateUserDto, user);
    return this.transformUserToResponse(updatedUser);
  }

  @Delete(':id')
  @UserAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Self/Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.usersService.remove(id, user);
  }

  @Post(':id/purchase')
  @UserAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add purchase to user (Self/Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Purchase added successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @HttpCode(HttpStatus.CREATED)
  async addPurchase(
    @Param('id') id: string,
    @Body() purchaseDto: PurchaseDto,
    @CurrentUser() user: any
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.addPurchase(id, purchaseDto, user);
    return this.transformUserToResponse(updatedUser);
  }

  @Patch(':id/status')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User status updated successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: 'active' | 'blocked' | 'deleted' },
    @CurrentUser() user: any
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateStatus(id, statusDto.status, user);
    return this.transformUserToResponse(updatedUser);
  }
}
