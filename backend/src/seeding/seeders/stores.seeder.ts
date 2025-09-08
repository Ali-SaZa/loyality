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

    // Find the store user (user with phone number 09122222222)
    const storeUser = this.users.find(user => user.phoneNumber === '09122222222');
    
    if (!storeUser) {
      throw new Error('Store user (09122222222) not found');
    }

    return [
      {
        name: 'Doris Accessories',
        phoneNumber: '09122222222',
        userId: storeUser._id,
        address: {
          province: 'Tehran',
          city: 'Tehran',
          fullAddress: 'Valiasr Street, Tehran, Iran'
        },
        status: 'active',
        planExpiryDate: new Date('2024-12-31'),
        logoUrl: 'https://example.com/doris-accessories-logo.jpg',
        description: 'Premium accessories store with comprehensive loyalty program',
        socialLinks: {
          website: 'https://dorisaccessories.ir',
          instagram: '@dorisaccessories',
          telegram: '@dorisaccessories'
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
