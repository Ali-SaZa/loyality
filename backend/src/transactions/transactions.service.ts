import { Injectable, ForbiddenException } from '@nestjs/common';
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

  private async validateTransactionAccess(transaction: TransactionDocument, user: any): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store users can access transactions related to their store
    if (user.role === 'store' && user.storeId === transaction.storeId.toString()) {
      return;
    }

    // Users can only access their own transactions
    if (user.role === 'customer' && user.userId === transaction.userId.toString()) {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به این تراکنش را ندارید.'); // translated to Persian
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

  async findOne(id: string, user: any): Promise<TransactionResponseDto> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new TransactionNotFoundException();
    }

    // Validate access permissions
    await this.validateTransactionAccess(transaction, user);

    return this.transformTransactionToResponse(transaction);
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, user: any): Promise<TransactionResponseDto> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new TransactionNotFoundException();
    }

    // Validate access permissions
    await this.validateTransactionAccess(transaction, user);

    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    
    if (!updatedTransaction) {
      throw new TransactionNotFoundException();
    }
    
    return this.transformTransactionToResponse(updatedTransaction);
  }

  async remove(id: string, user: any): Promise<void> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new TransactionNotFoundException();
    }

    // Validate access permissions
    await this.validateTransactionAccess(transaction, user);

    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new TransactionNotFoundException();
    }
  }

  async findByUser(userId: string, user: any): Promise<TransactionResponseDto[]> {
    // Validate access permissions
    if (user.role === 'admin') {
      // Admin can see all users
    } else if (user.role === 'customer' && user.userId === userId) {
      // User can see their own data
    } else if (user.role === 'store') {
      // Store users can see customer data related to their store
      // This will be validated by checking if transactions exist for this user in their store
    } else {
      throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به تراکنش‌های این کاربر را ندارید.'); // translated to Persian
    }

    const transactions = await this.transactionModel.find({ userId }).exec();
    return transactions.map(transaction => this.transformTransactionToResponse(transaction));
  }

  async findByStore(storeId: string, user: any): Promise<TransactionResponseDto[]> {
    // Validate access permissions
    if (user.role === 'admin') {
      // Admin can see all stores
    } else if (user.role === 'store' && user.storeId === storeId) {
      // Store users can see their own store data
    } else {
      throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به تراکنش‌های این فروشگاه را ندارید.'); // translated to Persian
    }

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
