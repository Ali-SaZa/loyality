import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Store, StoreDocument } from '../schemas/store.schema';
import { PromoCode, PromoCodeDocument } from '../schemas/promoCode.schema';
import { Promotion, PromotionDocument } from '../schemas/promotion.schema';
import { CreateTransactionDto, TransactionResponseDto, CustomerTransactionDto } from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { 
  TransactionNotFoundException,
  CustomConflictException 
} from '../common/errors';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
  ) {}

  private transformTransactionToResponse(transaction: TransactionDocument): TransactionResponseDto {
    // Type assertion for populated fields
    const populatedTransaction = transaction as TransactionDocument & {
      customerId: any;
      storeId: any;
      promoCodeId: any;
      promotionId: any;
    };

    return {
      id: transaction._id.toString(),
      customerId: populatedTransaction.populated('customerId') 
        ? populatedTransaction.customerId._id.toString()
        : transaction.customerId.toString(),
      storeId: populatedTransaction.populated('storeId') 
        ? populatedTransaction.storeId._id.toString()
        : transaction.storeId.toString(),
      promoCodeId: populatedTransaction.populated('promoCodeId') 
        ? populatedTransaction.promoCodeId._id.toString()
        : transaction.promoCodeId.toString(),
      promotionId: populatedTransaction.populated('promotionId') 
        ? populatedTransaction.promotionId._id.toString()
        : transaction.promotionId.toString(),
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      // Include populated data if available
      customer: populatedTransaction.populated('customerId') ? {
        id: populatedTransaction.customerId._id.toString(),
        phoneNumber: populatedTransaction.customerId.phoneNumber,
        firstName: populatedTransaction.customerId.firstName,
        lastName: populatedTransaction.customerId.lastName,
      } : undefined,
      store: populatedTransaction.populated('storeId') ? {
        id: populatedTransaction.storeId._id.toString(),
        name: populatedTransaction.storeId.name,
        phoneNumber: populatedTransaction.storeId.phoneNumber,
      } : undefined,
      promoCode: populatedTransaction.populated('promoCodeId') ? {
        id: populatedTransaction.promoCodeId._id.toString(),
        code: populatedTransaction.promoCodeId.code,
        status: populatedTransaction.promoCodeId.status,
      } : undefined,
      promotion: populatedTransaction.populated('promotionId') ? {
        id: populatedTransaction.promotionId._id.toString(),
        title: populatedTransaction.promotionId.title,
        price: populatedTransaction.promotionId.price,
        points: populatedTransaction.promotionId.points,
      } : undefined,
    };
  }

  async create(createTransactionDto: CreateTransactionDto, requestingUser: any): Promise<TransactionResponseDto> {
    // Validate that all referenced entities exist
    const [customer, store, promoCode, promotion] = await Promise.all([
      this.userModel.findById(createTransactionDto.customerId).exec(),
      this.storeModel.findById(createTransactionDto.storeId).exec(),
      this.promoCodeModel.findById(createTransactionDto.promoCodeId).exec(),
      this.promotionModel.findById(createTransactionDto.promotionId).exec(),
    ]);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Security: Verify that the requesting user has access to this store
    if (requestingUser.role === 'store' && store.userId.toString() !== requestingUser.id) {
      throw new ForbiddenException('You can only create transactions for your own store');
    }

    // Security: Verify that the promo code belongs to the specified promotion
    if (promoCode.promotionId.toString() !== createTransactionDto.promotionId) {
      throw new ForbiddenException('Promo code does not belong to the specified promotion');
    }

    // Security: Verify that the promotion belongs to the specified store
    if (promotion.storeId.toString() !== createTransactionDto.storeId) {
      throw new ForbiddenException('Promotion does not belong to the specified store');
    }

    // Check if transaction already exists for this promo code (prevent duplicates)
    const existingTransaction = await this.transactionModel.findOne({
      promoCodeId: createTransactionDto.promoCodeId
    }).exec();

    if (existingTransaction) {
      throw new CustomConflictException('Transaction', 'TRANSACTION_ALREADY_EXISTS');
    }

    const transaction = new this.transactionModel(createTransactionDto);
    const savedTransaction = await transaction.save();

    // Populate the data before transforming
    const populatedTransaction = await this.transactionModel
      .findById(savedTransaction._id)
      .populate('customerId', 'phoneNumber firstName lastName')
      .populate('storeId', 'name phoneNumber')
      .populate('promoCodeId', 'code status')
      .populate('promotionId', 'title price points')
      .exec();

    if (!populatedTransaction) {
      throw new TransactionNotFoundException();
    }

    return this.transformTransactionToResponse(populatedTransaction);
  }

  async findAll(request: ListRequestDto, requestingUser: any): Promise<ListResponseDto<TransactionResponseDto>> {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const skip = (page - 1) * limit;

    // Build filter query with role-based access control
    let filterQuery: any = {};

    // Store users can only see transactions for their stores
    if (requestingUser.role === 'store') {
      const userStores = await this.storeModel.find({ userId: requestingUser.id }).select('_id').exec();
      const storeIds = userStores.map(store => store._id);
      filterQuery.storeId = { $in: storeIds };
    }

    // Add search functionality
    if (request.search && request.searchFields && request.searchFields.length > 0) {
      const searchQueries = request.searchFields.map(field => ({
        [field]: { $regex: request.search, $options: 'i' }
      }));
      filterQuery.$or = searchQueries;
    }

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.transactionModel
        .find(filterQuery)
        .populate('customerId', 'phoneNumber firstName lastName')
        .populate('storeId', 'name phoneNumber')
        .populate('promoCodeId', 'code status')
        .populate('promotionId', 'title price points')
        .sort(this.buildSortQuery(request.sort))
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(filterQuery).exec()
    ]);

    // Transform the response data
    const transformedData = data.map(transaction => this.transformTransactionToResponse(transaction));

    const totalPages = Math.ceil(total / limit);

    return {
      data: transformedData,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      appliedFilters: {
        search: request.search,
        searchFields: request.searchFields,
        sort: request.sort,
        filters: request.filters
      }
    };
  }

  async findOne(id: string, requestingUser: any): Promise<TransactionResponseDto> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('customerId', 'phoneNumber firstName lastName')
      .populate('storeId', 'name phoneNumber')
      .populate('promoCodeId', 'code status')
      .populate('promotionId', 'title price points')
      .exec();

    if (!transaction) {
      throw new TransactionNotFoundException();
    }

    // Security: Verify access permissions
    await this.validateTransactionAccess(transaction, requestingUser);

    return this.transformTransactionToResponse(transaction);
  }

  async getStoreCustomers(storeId: string, requestingUser: any): Promise<CustomerTransactionDto[]> {
    // Security: Verify that the requesting user has access to this store
    if (requestingUser.role === 'store' && requestingUser.storeId !== storeId) {
      throw new ForbiddenException('You can only access customers for your own store');
    }

    // Verify store exists
    const store = await this.storeModel.findById(storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Get unique customers who have transactions with this store
    const customerTransactions = await this.transactionModel.aggregate([
      { $match: { storeId: new Types.ObjectId(storeId) } },
      {
        $group: {
          _id: '$customerId',
          totalTransactions: { $sum: 1 },
          firstTransactionDate: { $min: '$createdAt' },
          lastTransactionDate: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'customerId',
          as: 'allTransactions'
        }
      },
      {
        $addFields: {
          totalSpent: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$allTransactions',
                    cond: { $eq: ['$$this.storeId', new Types.ObjectId(storeId)] }
                  }
                },
                as: 'transaction',
                in: {
                  $let: {
                    vars: {
                      promotion: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: { $ifNull: ['$promotionDetails', []] },
                              cond: { $eq: ['$$this._id', '$$transaction.promotionId'] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: { $ifNull: ['$$promotion.price', 0] }
                  }
                }
              }
            }
          },
          totalPointsEarned: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$allTransactions',
                    cond: { $eq: ['$$this.storeId', new Types.ObjectId(storeId)] }
                  }
                },
                as: 'transaction',
                in: {
                  $let: {
                    vars: {
                      promotion: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: { $ifNull: ['$promotionDetails', []] },
                              cond: { $eq: ['$$this._id', '$$transaction.promotionId'] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: { $ifNull: ['$$promotion.points', 0] }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: '$customer._id',
          phoneNumber: '$customer.phoneNumber',
          firstName: '$customer.firstName',
          lastName: '$customer.lastName',
          status: '$customer.status',
          totalTransactions: 1,
          totalSpent: 1,
          totalPointsEarned: 1,
          firstTransactionDate: 1,
          lastTransactionDate: 1,
          lastActivity: '$customer.lastActivity'
        }
      },
      { $sort: { lastTransactionDate: -1 } }
    ]);

    return customerTransactions;
  }

  async getMyStoreCustomers(requestingUser: any): Promise<CustomerTransactionDto[]> {
    // Security: Only store users can access this endpoint
    if (requestingUser.role !== 'store') {
      throw new ForbiddenException('Only store users can access this endpoint');
    }

    // Get storeId from user context (set by GlobalAuthGuard)
    const storeId = requestingUser.storeId;
    if (!storeId) {
      throw new NotFoundException('Store not found for this user');
    }

    // Verify store exists
    const store = await this.storeModel.findById(storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Use the same aggregation logic as getStoreCustomers
    const customerTransactions = await this.transactionModel.aggregate([
      { $match: { storeId: new Types.ObjectId(storeId) } },
      {
        $group: {
          _id: '$customerId',
          totalTransactions: { $sum: 1 },
          firstTransactionDate: { $min: '$createdAt' },
          lastTransactionDate: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'customerId',
          as: 'allTransactions'
        }
      },
      {
        $lookup: {
          from: 'promotions',
          localField: 'allTransactions.promotionId',
          foreignField: '_id',
          as: 'promotionDetails'
        }
      },
      {
        $addFields: {
          totalSpent: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$allTransactions',
                    cond: { $eq: ['$$this.storeId', new Types.ObjectId(storeId)] }
                  }
                },
                as: 'transaction',
                in: {
                  $let: {
                    vars: {
                      promotion: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: { $ifNull: ['$promotionDetails', []] },
                              cond: { $eq: ['$$this._id', '$$transaction.promotionId'] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: { $ifNull: ['$$promotion.price', 0] }
                  }
                }
              }
            }
          },
          totalPointsEarned: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$allTransactions',
                    cond: { $eq: ['$$this.storeId', new Types.ObjectId(storeId)] }
                  }
                },
                as: 'transaction',
                in: {
                  $let: {
                    vars: {
                      promotion: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: { $ifNull: ['$promotionDetails', []] },
                              cond: { $eq: ['$$this._id', '$$transaction.promotionId'] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: { $ifNull: ['$$promotion.points', 0] }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: '$customer._id',
          phoneNumber: '$customer.phoneNumber',
          firstName: '$customer.firstName',
          lastName: '$customer.lastName',
          status: '$customer.status',
          totalTransactions: 1,
          totalSpent: 1,
          totalPointsEarned: 1,
          firstTransactionDate: 1,
          lastTransactionDate: 1,
          lastActivity: '$customer.lastActivity'
        }
      },
      { $sort: { lastTransactionDate: -1 } }
    ]);

    // Transform the aggregation results to match CustomerTransactionDto
    return customerTransactions.map(customer => ({
      id: customer.id ? customer.id.toString() : customer._id.toString(),
      phoneNumber: customer.phoneNumber,
      firstName: customer.firstName,
      lastName: customer.lastName,
      status: customer.status,
      totalTransactions: customer.totalTransactions,
      totalSpent: customer.totalSpent || 0,
      totalPointsEarned: customer.totalPointsEarned || 0,
      firstTransactionDate: customer.firstTransactionDate,
      lastTransactionDate: customer.lastTransactionDate,
      lastActivity: customer.lastActivity
    }));
  }

  async getCustomerTransactions(customerId: string, requestingUser: any): Promise<TransactionResponseDto[]> {
    // Security: Verify access permissions
    if (requestingUser.role === 'customer' && requestingUser._id.toString() !== customerId) {
      throw new ForbiddenException('You can only access your own transactions');
    }

    let query: any = { customerId: new Types.ObjectId(customerId) };

    // For store users, ensure they can only access customers related to their stores
    if (requestingUser.role === 'store') {
      const userStores = await this.storeModel.find({ userId: requestingUser._id }).select('_id').exec();
      const storeIds = userStores.map(store => store._id);
      
      // Add store filter to the query
      query.storeId = { $in: storeIds };
    }

    const transactions = await this.transactionModel
      .find(query)
      .populate('customerId', 'phoneNumber firstName lastName')
      .populate('storeId', 'name phoneNumber')
      .populate('promoCodeId', 'code status')
      .populate('promotionId', 'title price points')
      .sort({ createdAt: -1 })
      .exec();

    return transactions.map(transaction => this.transformTransactionToResponse(transaction));
  }

  async remove(id: string, requestingUser: any): Promise<void> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new TransactionNotFoundException();
    }

    // Security: Verify access permissions
    await this.validateTransactionAccess(transaction, requestingUser);

    await this.transactionModel.findByIdAndDelete(id).exec();
  }

  private async validateTransactionAccess(transaction: TransactionDocument, requestingUser: any): Promise<void> {
    // Admin can access everything
    if (requestingUser.role === 'admin') {
      return;
    }

    // Store users can only access transactions for their stores
    if (requestingUser.role === 'store') {
      const store = await this.storeModel.findById(transaction.storeId).exec();
      if (!store || store.userId.toString() !== requestingUser.id) {
        throw new ForbiddenException('You do not have permission to access this transaction');
      }
      return;
    }

    // Customer users can only access their own transactions
    if (requestingUser.role === 'customer' && transaction.customerId.toString() === requestingUser.id) {
      return;
    }

    throw new ForbiddenException('You do not have permission to access this transaction');
  }

  private buildSortQuery(sort: any): any {
    if (!sort || sort.length === 0) {
      return { createdAt: -1 };
    }

    const sortQuery: any = {};
    sort.forEach((item: any) => {
      sortQuery[item.field] = item.direction === 'asc' ? 1 : -1;
    });
    return sortQuery;
  }

  async count(filter: any = {}): Promise<number> {
    return this.transactionModel.countDocuments(filter).exec();
  }
}
