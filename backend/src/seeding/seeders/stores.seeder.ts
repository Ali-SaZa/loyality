import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store, StoreDocument } from '../../schemas/store.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class StoresSeeder extends BaseSeeder<StoreDocument> {
  private users: UserDocument[] = [];

  constructor(
    @InjectModel(Store.name) private storesModel: Model<StoreDocument>
  ) {
    super();
  }

  setUsers(users: UserDocument[]) {
    this.users = users;
  }

  protected get model(): Model<StoreDocument> {
    return this.storesModel;
  }

  protected get data(): any[] {
    if (this.users.length === 0) {
      throw new Error('Users must be set before seeding stores');
    }

    // Find store users (users with role 'store')
    const storeUsers = this.users.filter(user => user.role === 'store');
    
    if (storeUsers.length < 3) {
      throw new Error('Need at least 3 store users to seed stores');
    }

    return [
      {
        name: 'Tehran Mall',
        phoneNumber: '09123456789',
        userId: storeUsers[0]._id,
        address: {
          province: 'Tehran',
          city: 'Tehran',
          fullAddress: 'Valiasr Street, Tehran Mall, Tehran, Iran'
        },
        status: 'active',
        planExpiryDate: new Date('2024-12-31'),
        logoUrl: 'https://example.com/tehran-mall-logo.jpg',
        description: 'Premium shopping mall in Tehran with comprehensive loyalty program',
        socialLinks: {
          website: 'https://tehranmall.ir',
          instagram: '@tehranmall',
          telegram: '@tehranmall'
        },
        workingHours: {
          open: '09:00',
          close: '22:00'
        }
      },
      {
        name: 'Isfahan Bazaar',
        phoneNumber: '09187654321',
        userId: storeUsers[1]._id,
        address: {
          province: 'Isfahan',
          city: 'Isfahan',
          fullAddress: 'Naqsh-e Jahan Square, Isfahan Bazaar, Isfahan, Iran'
        },
        status: 'active',
        planExpiryDate: new Date('2024-12-31'),
        logoUrl: 'https://example.com/isfahan-bazaar-logo.jpg',
        description: 'Traditional bazaar in Isfahan with basic loyalty features',
        socialLinks: {
          instagram: '@isfahanbazaar',
          telegram: '@isfahanbazaar'
        },
        workingHours: {
          open: '08:00',
          close: '20:00'
        }
      },
      {
        name: 'Shiraz Market',
        phoneNumber: '09111223344',
        userId: storeUsers[2]._id,
        address: {
          province: 'Fars',
          city: 'Shiraz',
          fullAddress: 'Vakil Bazaar, Shiraz Market, Shiraz, Iran'
        },
        status: 'active',
        planExpiryDate: new Date('2024-12-31'),
        logoUrl: 'https://example.com/shiraz-market-logo.jpg',
        description: 'Modern market in Shiraz with premium features and lottery system',
        socialLinks: {
          website: 'https://shirazmarket.ir',
          instagram: '@shirazmarket',
          telegram: '@shirazmarket'
        },
        workingHours: {
          open: '09:00',
          close: '21:00'
        }
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
