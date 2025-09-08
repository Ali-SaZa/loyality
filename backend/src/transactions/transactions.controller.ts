import { 
  Controller, 
  Get, 
  Post, 
  Body, 
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
  ApiBearerAuth
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionResponseDto, CustomerTransactionDto, AddDirectCustomerDto, DirectCustomerResponseDto } from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserAuth, AdminAuth, StoreOrAdminAuth } from '../common/security';

@ApiTags('Transactions')
@Controller('transactions')
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new transaction (Store/Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Transaction created successfully',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Transaction already exists' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Post('direct-customer')
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add existing customer to store (Store only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Customer added to store successfully',
    type: DirectCustomerResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Customer or store not found' })
  @ApiResponse({ status: 409, description: 'Customer already exists in store' })
  async addDirectCustomer(
    @Body() addDirectCustomerDto: AddDirectCustomerDto,
    @CurrentUser() user: any
  ): Promise<DirectCustomerResponseDto> {
    return this.transactionsService.addDirectCustomer(addDirectCustomerDto, user);
  }

  @Get()
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all transactions with pagination and filtering' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transactions retrieved successfully',
    type: ListResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() listRequest: ListRequestDto,
    @CurrentUser() user: any
  ): Promise<ListResponseDto<TransactionResponseDto>> {
    return this.transactionsService.findAll(listRequest, user);
  }

  @Get(':id')
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction found',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(id, user);
  }

  @Get('store/:storeId/customers')
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customers for a specific store (Store/Admin only)' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Store customers retrieved successfully',
    type: [CustomerTransactionDto] 
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStoreCustomers(
    @Param('storeId') storeId: string,
    @CurrentUser() user: any
  ): Promise<CustomerTransactionDto[]> {
    return this.transactionsService.getStoreCustomers(storeId, user);
  }

  @Get('my-store/customers')
  @StoreOrAdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customers for the current user\'s store (Store only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Store customers retrieved successfully',
    type: [CustomerTransactionDto] 
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Store access required' })
  async getMyStoreCustomers(
    @CurrentUser() user: any
  ): Promise<CustomerTransactionDto[]> {
    return this.transactionsService.getMyStoreCustomers(user);
  }

  @Get('customer/:customerId')
  @StoreOrAdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions for a specific customer (Store/Admin only)' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Customer transactions retrieved successfully',
    type: [TransactionResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Store/Admin access required' })
  async getCustomerTransactions(
    @Param('customerId') customerId: string,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.getCustomerTransactions(customerId, user);
  }

  @Delete(':id')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete transaction (Admin only)' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.transactionsService.remove(id, user);
  }
}
