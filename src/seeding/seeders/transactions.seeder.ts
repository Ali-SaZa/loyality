import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { StoreDocument } from '../../schemas/store.schema';
import { UserDocument } from '../../schemas/user.schema';
import { ScratchCardDocument } from '../../schemas/scratch-card.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class TransactionsSeeder extends BaseSeeder<TransactionDocument> {
  private stores: StoreDocument[] = [];
  private users: UserDocument[] = [];
  private scratchCards: ScratchCardDocument[] = [];

  constructor(
    @InjectModel(Transaction.name) private transactionsModel: Model<TransactionDocument>
  ) {
    super();
  }

  protected get model(): Model<TransactionDocument> {
    return this.transactionsModel;
  }

  setDependencies(
    stores: StoreDocument[], 
    users: UserDocument[], 
    scratchCards: ScratchCardDocument[]
  ): void {
    this.stores = stores;
    this.users = users;
    this.scratchCards = scratchCards;
  }

  protected get data(): any[] {
    if (this.stores.length === 0 || this.users.length === 0) {
      throw new Error('Stores and users must be set before seeding transactions');
    }

    return [
      {
        userId: this.users[0]._id,
        storeId: this.stores[0]._id,
        type: 'purchase',
        amount: 150000,
        scratchCode: 'SCR001000001',
        entryMethod: 'sms',
        description: 'Purchase at Tehran Mall'
      },
      {
        userId: this.users[0]._id,
        storeId: this.stores[0]._id,
        type: 'purchase',
        amount: 300000,
        entryMethod: 'qr',
        description: 'Large purchase at Tehran Mall'
      },
      {
        userId: this.users[1]._id,
        storeId: this.stores[1]._id,
        type: 'purchase',
        amount: 80000,
        entryMethod: 'sms',
        description: 'Purchase at Isfahan Bazaar'
      },
      {
        userId: this.users[2]._id,
        storeId: this.stores[2]._id,
        type: 'purchase',
        amount: 400000,
        entryMethod: 'qr',
        description: 'Purchase at Shiraz Market'
      },
      {
        userId: this.users[2]._id,
        storeId: this.stores[0]._id,
        type: 'purchase',
        amount: 600000,
        entryMethod: 'sms',
        description: 'Premium purchase at Tehran Mall'
      },
      {
        userId: this.users[3]._id,
        storeId: this.stores[1]._id,
        type: 'purchase',
        amount: 120000,
        entryMethod: 'sms',
        description: 'Purchase at Isfahan Bazaar'
      },
      {
        userId: this.users[4]._id,
        storeId: this.stores[2]._id,
        type: 'purchase',
        amount: 250000,
        entryMethod: 'qr',
        description: 'Purchase at Shiraz Market'
      },
      {
        userId: this.users[4]._id,
        storeId: this.stores[0]._id,
        type: 'purchase',
        amount: 450000,
        entryMethod: 'sms',
        description: 'Large purchase at Tehran Mall'
      },
      {
        userId: this.users[2]._id,
        storeId: this.stores[0]._id,
        type: 'cashback',
        amount: 100000,
        scratchCode: 'SCR002000002',
        entryMethod: 'sms',
        description: 'Scratch card redemption'
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
