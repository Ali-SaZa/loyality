import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../../schemas/store.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class StoresSeeder extends BaseSeeder<StoreDocument> {
  constructor(
    @InjectModel(Store.name) private storesModel: Model<StoreDocument>
  ) {
    super();
  }

  protected get model(): Model<StoreDocument> {
    return this.storesModel;
  }

  protected get data(): any[] {
    return [
      {
        name: 'Tehran Mall',
        ownerName: 'Ahmad Rezaei',
        phoneNumber: '09123456789',
        address: {
          city: 'Tehran',
          street: 'Valiasr Street',
          coordinates: { lat: 35.6892, lng: 51.3890 }
        },
        loyaltySettings: {
          tiers: [
            { minAmount: 100000, rewardType: 'discount', value: 5, description: '5% discount' },
            { minAmount: 500000, rewardType: 'cashback', value: 10, description: '10% cashback' },
            { minAmount: 1000000, rewardType: 'lottery', value: 1, description: 'Lottery entry' }
          ],
          lotteryFrequency: 'monthly',
          defaultCashbackRate: 2
        },
        plan: {
          type: 'premium',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        }
      },
      {
        name: 'Isfahan Bazaar',
        ownerName: 'Fatemeh Karimi',
        phoneNumber: '09187654321',
        address: {
          city: 'Isfahan',
          street: 'Naqsh-e Jahan Square',
          coordinates: { lat: 32.6546, lng: 51.6680 }
        },
        loyaltySettings: {
          tiers: [
            { minAmount: 50000, rewardType: 'discount', value: 3, description: '3% discount' },
            { minAmount: 200000, rewardType: 'cashback', value: 7, description: '7% cashback' }
          ],
          lotteryFrequency: 'weekly',
          defaultCashbackRate: 1.5
        },
        plan: {
          type: 'free',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        }
      },
      {
        name: 'Shiraz Market',
        ownerName: 'Hassan Mohammadi',
        phoneNumber: '09111223344',
        address: {
          city: 'Shiraz',
          street: 'Vakil Bazaar',
          coordinates: { lat: 29.5916, lng: 52.5836 }
        },
        loyaltySettings: {
          tiers: [
            { minAmount: 75000, rewardType: 'discount', value: 4, description: '4% discount' },
            { minAmount: 300000, rewardType: 'lottery', value: 1, description: 'Lottery entry' }
          ],
          lotteryFrequency: 'monthly',
          defaultCashbackRate: 2.5
        },
        plan: {
          type: 'premium',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        }
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
