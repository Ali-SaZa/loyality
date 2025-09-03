import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { Store, StoreDocument } from '../../schemas/store.schema';
import { PromoCode, PromoCodeDocument } from '../../schemas/promoCode.schema';
import { Promotion, PromotionDocument } from '../../schemas/promotion.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class TransactionsSeeder extends BaseSeeder<TransactionDocument> {
  private users: UserDocument[] = [];
  private stores: StoreDocument[] = [];
  private promoCodes: PromoCodeDocument[] = [];
  private promotions: PromotionDocument[] = [];

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>
  ) {
    super();
  }

  protected get model(): Model<TransactionDocument> {
    return this.transactionModel;
  }

  protected get data(): any[] {
    if (this.users.length === 0) {
      throw new Error('Users must be set before seeding transactions');
    }
    if (this.stores.length === 0) {
      throw new Error('Stores must be set before seeding transactions');
    }
    if (this.promoCodes.length === 0) {
      throw new Error('Promo codes must be set before seeding transactions');
    }
    if (this.promotions.length === 0) {
      throw new Error('Promotions must be set before seeding transactions');
    }

    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get customer users and used promo codes
    const customerUsers = this.users.filter(user => user.role === 'customer');
    const usedPromoCodes = this.promoCodes.filter(promoCode => promoCode.status === 'used' && promoCode.userId);

    const transactions: any[] = [];

    // Create transactions for used promo codes
    usedPromoCodes.forEach((promoCode, index) => {
      const customer = customerUsers.find(user => user._id.toString() === promoCode.userId?.toString());
      const promotion = this.promotions.find(promotion => promotion._id.toString() === promoCode.promotionId.toString());
      const store = this.stores.find(store => store._id.toString() === promotion?.storeId.toString());

      if (customer && promotion && store) {
        // Create transaction with realistic dates
        const transactionDate = new Date(oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime()));
        
        transactions.push({
          customerId: customer._id,
          storeId: store._id,
          promoCodeId: promoCode._id,
          promotionId: promotion._id,
          createdAt: transactionDate,
          updatedAt: transactionDate
        });
      }
    });

    // Add some additional sample transactions for demonstration
    const sampleTransactions = [
      {
        customerId: customerUsers[0]?._id,
        storeId: this.stores[0]?._id,
        promoCodeId: usedPromoCodes[0]?._id,
        promotionId: this.promotions[0]?._id,
        createdAt: oneMonthAgo,
        updatedAt: oneMonthAgo
      },
      {
        customerId: customerUsers[1]?._id,
        storeId: this.stores[0]?._id,
        promoCodeId: usedPromoCodes[1]?._id,
        promotionId: this.promotions[0]?._id,
        createdAt: twoWeeksAgo,
        updatedAt: twoWeeksAgo
      },
      {
        customerId: customerUsers[2]?._id,
        storeId: this.stores[1]?._id,
        promoCodeId: usedPromoCodes[2]?._id,
        promotionId: this.promotions[1]?._id,
        createdAt: oneWeekAgo,
        updatedAt: oneWeekAgo
      },
      {
        customerId: customerUsers[0]?._id,
        storeId: this.stores[1]?._id,
        promoCodeId: usedPromoCodes[3]?._id,
        promotionId: this.promotions[1]?._id,
        createdAt: threeDaysAgo,
        updatedAt: threeDaysAgo
      },
      {
        customerId: customerUsers[1]?._id,
        storeId: this.stores[0]?._id,
        promoCodeId: usedPromoCodes[4]?._id,
        promotionId: this.promotions[0]?._id,
        createdAt: oneDayAgo,
        updatedAt: oneDayAgo
      }
    ];

    // Filter out any undefined values and add to transactions
    sampleTransactions.forEach(transaction => {
      if (transaction.customerId && transaction.storeId && transaction.promoCodeId && transaction.promotionId) {
        transactions.push(transaction);
      }
    });

    return transactions;
  }

  protected getData(): any[] {
    return this.data;
  }

  // Setter methods to be called by the main seeder
  setUsers(users: UserDocument[]): void {
    this.users = users;
  }

  setStores(stores: StoreDocument[]): void {
    this.stores = stores;
  }

  setPromoCodes(promoCodes: PromoCodeDocument[]): void {
    this.promoCodes = promoCodes;
  }

  setPromotions(promotions: PromotionDocument[]): void {
    this.promotions = promotions;
  }
}
