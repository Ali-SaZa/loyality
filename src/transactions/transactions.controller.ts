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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionResponseDto } from '../dto';
import { TransactionAuth, AdminAuth, StoreAuth, UserAuth } from '../common/security';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new transaction (Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Transaction created successfully',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all transactions (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all transactions',
    type: [TransactionResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findAll();
  }

  @Get('analytics')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction analytics (Admin only)' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for analytics' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for analytics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction analytics data'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAnalytics(
    @Query('storeId') storeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.transactionsService.getAnalytics(storeId, start, end);
  }

  @Get(':id')
  @TransactionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction by ID (Owner/Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction found',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(id, user);
  }

  @Patch(':id')
  @TransactionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transaction (Owner/Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction updated successfully',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.update(id, updateTransactionDto, user);
  }

  @Delete(':id')
  @TransactionAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete transaction (Owner/Store Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.transactionsService.remove(id, user);
  }

  @Get('user/:userId')
  @UserAuth({ paramName: 'userId' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions by user (Self/Store Owner/Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions for the user',
    type: [TransactionResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findByUser(
    @Param('userId') userId: string,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findByUser(userId, user);
  }

  @Get('store/:storeId')
  @StoreAuth({ paramName: 'storeId' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions by store (Store Owner/Admin only)' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions for the store',
    type: [TransactionResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findByStore(
    @Param('storeId') storeId: string,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findByStore(storeId, user);
  }

  @Get('type/:type')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions by type (Admin only)' })
  @ApiParam({ name: 'type', description: 'Transaction type', enum: ['purchase', 'cashback', 'lottery'] })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions of the specified type',
    type: [TransactionResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findByType(@Param('type') type: 'purchase' | 'cashback' | 'lottery'): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findByType(type);
  }
}
