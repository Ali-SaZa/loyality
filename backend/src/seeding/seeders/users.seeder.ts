import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { StoreDocument } from '../../schemas/store.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class UsersSeeder extends BaseSeeder<UserDocument> {
  private stores: StoreDocument[] = [];

  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>
  ) {
    super();
  }

  protected get model(): Model<UserDocument> {
    return this.usersModel;
  }

  setStores(stores: StoreDocument[]): void {
    this.stores = stores;
  }

  protected get data(): any[] {
    if (this.stores.length === 0) {
      throw new Error('فروشگاه‌ها باید قبل از بذرگذاری کاربران تنظیم شوند'); // translated to Persian
    }

    return [
      {
        phoneNumber: '09111111111',
        firstname: 'Ali',
        lastname: 'Ahmadi',
        totalPoints: 1250,
        purchases: [
          {
            storeId: this.stores[0]._id,
            amount: 150000,
            date: new Date('2024-01-15'),
            entryMethod: 'sms',
            rewardApplied: { type: 'discount', value: 5 }
          },
          {
            storeId: this.stores[0]._id,
            amount: 300000,
            date: new Date('2024-02-01'),
            entryMethod: 'qr',
            rewardApplied: { type: 'cashback', value: 10 }
          }
        ]
      },
      {
        phoneNumber: '09122222222',
        firstname: 'Sara',
        lastname: 'Karimi',
        totalPoints: 850,
        purchases: [
          {
            storeId: this.stores[1]._id,
            amount: 80000,
            date: new Date('2024-01-20'),
            entryMethod: 'sms',
            rewardApplied: { type: 'discount', value: 3 }
          }
        ]
      },
      {
        phoneNumber: '09133333333',
        firstname: 'Reza',
        lastname: 'Mohammadi',
        totalPoints: 2100,
        purchases: [
          {
            storeId: this.stores[2]._id,
            amount: 400000,
            date: new Date('2024-01-10'),
            entryMethod: 'qr',
            rewardApplied: { type: 'lottery', value: 1 }
          },
          {
            storeId: this.stores[0]._id,
            amount: 600000,
            date: new Date('2024-02-05'),
            entryMethod: 'sms',
            rewardApplied: { type: 'cashback', value: 10 }
          }
        ]
      },
      {
        phoneNumber: '09144444444',
        firstname: 'Narges',
        lastname: 'Hashemi',
        totalPoints: 450,
        purchases: [
          {
            storeId: this.stores[1]._id,
            amount: 120000,
            date: new Date('2024-01-25'),
            entryMethod: 'sms',
            rewardApplied: { type: 'discount', value: 3 }
          }
        ]
      },
      {
        phoneNumber: '09155555555',
        firstname: 'Amir',
        lastname: 'Hosseini',
        totalPoints: 1800,
        purchases: [
          {
            storeId: this.stores[2]._id,
            amount: 250000,
            date: new Date('2024-01-30'),
            entryMethod: 'qr',
            rewardApplied: { type: 'discount', value: 4 }
          },
          {
            storeId: this.stores[0]._id,
            amount: 450000,
            date: new Date('2024-02-10'),
            entryMethod: 'sms',
            rewardApplied: { type: 'cashback', value: 10 }
          }
        ]
      },
      {
        phoneNumber: '09166666666',
        firstname: 'Store',
        lastname: 'One',
        totalPoints: 0,
        role: 'store',
        storeName: 'فروشگاه مرکزی',
        address: 'تهران، خیابان ولیعصر، پلاک 123',
        description: 'فروشگاه مرکزی با بیش از 20 سال سابقه در ارائه خدمات با کیفیت',
        purchases: []
      },
      {
        phoneNumber: '09177777777',
        firstname: 'Store',
        lastname: 'Two',
        totalPoints: 0,
        role: 'store',
        storeName: 'فروشگاه الکترونیک',
        address: 'اصفهان، خیابان چهارباغ، پلاک 456',
        description: 'فروشگاه تخصصی در زمینه لوازم الکترونیکی و دیجیتال',
        purchases: []
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
