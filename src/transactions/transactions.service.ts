import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { CreateTransactionDto, UpdateTransactionDto, TransactionResponseDto } from '../dto';
import { TransactionNotFoundException } from '../common/errors';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  private transformTransactionToResponse(transaction: TransactionDocument): TransactionResponseDto {
    return {
      id: transaction._id.toString(),
      userId: transaction.userId.toString(),
      storeId: transaction.storeId.toString(),
      type: transaction.type,
      amount: transaction.amount,
      scratchCode: transaction.scratchCode,
      entryMethod: transaction.entryMethod,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  async create(createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const transaction = new this.transactionModel({
      ...createTransactionDto,
      userId: new Types.ObjectId(createTransactionDto.userId),
      storeId: new Types.ObjectId(createTransactionDto.storeId),
    });
    const savedTransaction = await transaction.save();
    return this.transformTransactionToResponse(savedTransaction);
  }

  async findAll(): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionModel.find().exec();
    return transactions.map(transaction => this.transformTransactionToResponse(transaction));
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new TransactionNotFoundException();
    }
    return this.transformTransactionToResponse(transaction);
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<TransactionResponseDto> {
    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    
    if (!transaction) {
      throw new TransactionNotFoundException();
    }
    
    return this.transformTransactionToResponse(transaction);
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new TransactionNotFoundException();
    }
  }

  async findByUser(userId: string): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionModel.find({ userId }).exec();
    return transactions.map(transaction => this.transformTransactionToResponse(transaction));
  }

  async findByStore(storeId: string): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionModel.find({ storeId }).exec();
    return transactions.map(transaction => this.transformTransactionToResponse(transaction));
  }

  async findByType(type: 'purchase' | 'cashback' | 'lottery'): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionModel.find({ type }).exec();
    return transactions.map(transaction => this.transformTransactionToResponse(transaction));
  }

  async getAnalytics(storeId?: string, startDate?: Date, endDate?: Date) {
    const matchFilter: any = {};
    
    if (storeId) {
      matchFilter.storeId = new Types.ObjectId(storeId);
    }
    
    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = startDate;
      if (endDate) matchFilter.createdAt.$lte = endDate;
    }

    const analytics = await this.transactionModel.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    return analytics;
  }
}
