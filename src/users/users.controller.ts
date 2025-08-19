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
      name: user.name,
      totalPoints: user.totalPoints,
      purchases: user.purchases.map(purchase => ({
        storeId: purchase.storeId.toString(),
        amount: purchase.amount,
        date: purchase.date,
        scratchCode: purchase.scratchCode,
        entryMethod: purchase.entryMethod,
        rewardApplied: purchase.rewardApplied,
      })),
      consents: user.consents,
      role: user.role,
      lastActivity: user.lastActivity,
      tags: user.tags,
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
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or phone number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [UserResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => this.transformUserToResponse(user));
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
  @ApiOperation({ summary: 'Get user by ID (Self/Admin/Store Owner only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return this.transformUserToResponse(user);
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
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return this.transformUserToResponse(user);
  }

  @Delete(':id')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post(':id/purchases')
  @UserAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a purchase to user (Self/Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Purchase added successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async addPurchase(
    @Param('id') id: string,
    @Body() purchaseDto: PurchaseDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.addPurchase(id, purchaseDto);
    return this.transformUserToResponse(user);
  }

  @Patch(':id/consents')
  @UserAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user consent preferences (Self/Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Consents updated successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async updateConsents(
    @Param('id') id: string,
    @Body() consents: { dataCollection: boolean; marketing: boolean },
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updateConsents(
      id,
      consents.dataCollection,
      consents.marketing,
    );
    return this.transformUserToResponse(user);
  }
}
