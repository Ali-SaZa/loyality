import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromoCode, PromoCodeDocument } from '../../schemas/promoCode.schema';
import { StoreDocument } from '../../schemas/store.schema';
import { UserDocument } from '../../schemas/user.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class ScratchCardsSeeder extends BaseSeeder<ScratchCardDocument> {
  private stores: StoreDocument[] = [];
  private users: UserDocument[] = [];

  constructor(
    @InjectModel(ScratchCard.name) private scratchCardsModel: Model<ScratchCardDocument>
  ) {
    super();
  }

  protected get model(): Model<ScratchCardDocument> {
    return this.scratchCardsModel;
  }

  setDependencies(stores: StoreDocument[], users: UserDocument[]): void {
    this.stores = stores;
    this.users = users;
  }

  protected get data(): any[] {
    if (this.stores.length === 0 || this.users.length === 0) {
      throw new Error('فروشگاه‌ها و کاربران باید قبل از بذرگذاری کارت‌های تخفیف تنظیم شوند'); // translated to Persian
    }

    return [
      {
        code: 'SCR001000001',
        storeId: this.stores[0]._id,
        userId: this.users[0]._id,
        status: 'unused',
        reward: { type: 'discount', value: 50000 },
        entryMethod: 'sms',
        qrUrl: 'https://qr.example.com/SCR001000001',
        expiresAt: new Date('2024-12-31')
      },
      {
        code: 'SCR002000002',
        storeId: this.stores[0]._id,
        userId: this.users[2]._id,
        status: 'used',
        reward: { type: 'cashback', value: 100000 },
        entryMethod: 'qr',
        qrUrl: 'https://qr.example.com/SCR002000002',
        usedAt: new Date('2024-02-01'),
        expiresAt: new Date('2024-12-31')
      },
      {
        code: 'SCR003000003',
        storeId: this.stores[1]._id,
        userId: this.users[1]._id,
        status: 'unused',
        reward: { type: 'discount', value: 25000 },
        entryMethod: 'sms',
        qrUrl: 'https://qr.example.com/SCR003000003',
        expiresAt: new Date('2024-12-31')
      },
      {
        code: 'SCR004000004',
        storeId: this.stores[2]._id,
        userId: this.users[3]._id,
        status: 'unused',
        reward: { type: 'lottery', value: 1 },
        entryMethod: 'qr',
        qrUrl: 'https://qr.example.com/SCR004000004',
        expiresAt: new Date('2024-12-31')
      },
      {
        code: 'SCR005000005',
        storeId: this.stores[0]._id,
        userId: this.users[4]._id,
        status: 'unused',
        reward: { type: 'cashback', value: 150000 },
        entryMethod: 'sms',
        qrUrl: 'https://qr.example.com/SCR005000005',
        expiresAt: new Date('2024-12-31')
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
