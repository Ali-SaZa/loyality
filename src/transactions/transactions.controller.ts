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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionResponseDto } from '../dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ 
    status: 201, 
    description: 'Transaction created successfully',
    type: TransactionResponseDto 
  })
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all transactions',
    type: [TransactionResponseDto] 
  })
  async findAll(): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findAll();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get transaction analytics' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for analytics' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for analytics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction analytics data'
  })
  async getAnalytics(
    @Query('storeId') storeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.transactionsService.getAnalytics(storeId, start, end);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get transactions by user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions for the user',
    type: [TransactionResponseDto] 
  })
  async findByUser(@Param('userId') userId: string): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findByUser(userId);
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get transactions by store' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions for the store',
    type: [TransactionResponseDto] 
  })
  async findByStore(@Param('storeId') storeId: string): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findByStore(storeId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get transactions by type' })
  @ApiParam({ name: 'type', description: 'Transaction type', enum: ['purchase', 'cashback', 'lottery'] })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions of the specified type',
    type: [TransactionResponseDto] 
  })
  async findByType(@Param('type') type: 'purchase' | 'cashback' | 'lottery'): Promise<TransactionResponseDto[]> {
    return this.transactionsService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction found',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction information' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction updated successfully',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    return this.transactionsService.remove(id);
  }
}
