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
import { CreateUserDto, UpdateUserDto, UserResponseDto, CreateCustomerDto, CustomerResponseDto } from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { UserNotFoundException } from '../common/errors';
import { PERSIAN_ERROR_MESSAGES } from '../common/errors';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserAuth, AdminAuth } from '../common/security';
import { TransactionsService } from '../transactions/transactions.service';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService
  ) {}

  private transformUserToResponse(user: any): UserResponseDto {
    // Handle the ID field more safely
    let userId = 'unknown';
    if (user.id) {
      // If id is an ObjectId (has buffer property), convert it to string
      if (user.id.buffer && Array.isArray(user.id.buffer.data)) {
        userId = user.id.toString();
      } else if (typeof user.id === 'string') {
        userId = user.id;
      } else {
        userId = user.id.toString();
      }
    } else if (user._id && typeof user._id.toString === 'function') {
      userId = user._id.toString();
    }
    
    return {
      id: userId,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,


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

  @Post('customers')
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new customer user (Store only)' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Customer created successfully or customer already exists',
    type: CustomerResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Store access required' })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser() user: any
  ): Promise<CustomerResponseDto> {
    const result = await this.usersService.createCustomer(createCustomerDto);
    
    if (result.isExisting) {
      // Check if this customer is already associated with the current store
      const isAlreadyInStore = await this.checkIfCustomerInStore(result.customer._id.toString(), user.storeId);
      
      if (isAlreadyInStore) {
        return {
          id: result.customer._id.toString(),
          error: PERSIAN_ERROR_MESSAGES.CUSTOMER_ALREADY_IN_STORE,
          isAlreadyInStore: true
        };
      } else {
        return {
          id: result.customer._id.toString(),
          error: PERSIAN_ERROR_MESSAGES.CUSTOMER_PHONE_EXISTS
        };
      }
    }
    
    return {
      id: result.customer._id.toString()
    };
  }

  private async checkIfCustomerInStore(customerId: string, storeId: string): Promise<boolean> {
    try {
      // Use the existing getStoreCustomers method to check if customer is in store
      const storeCustomers = await this.transactionsService.getStoreCustomers(storeId, { role: 'store', storeId });
      
      // Check if the customer ID exists in the store's customers
      return storeCustomers.some(customer => customer.id === customerId);
    } catch (error) {
      // If there's an error, assume customer is not in store
      return false;
    }
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

  @Get('stats')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User statistics',
    type: Object 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getStats(): Promise<{ total: number; active: number; blocked: number; deleted: number }> {
    const [total, active, blocked, deleted] = await Promise.all([
      this.usersService.count(),
      this.usersService.count({ status: 'active' }),
      this.usersService.count({ status: 'blocked' }),
      this.usersService.count({ status: 'deleted' })
    ]);

    return {
      total,
      active,
      blocked,
      deleted
    };
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
