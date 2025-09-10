import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class UsersSeeder extends BaseSeeder<UserDocument> {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>
  ) {
    super();
  }

  protected get model(): Model<UserDocument> {
    return this.usersModel;
  }

  protected get data(): any[] {
    return [
      // Required users with specific phone numbers for testing
      {
        phoneNumber: '09121111111',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        phoneNumber: '09122222222',
        firstName: 'Store',
        lastName: 'Admin',
        role: 'store'
      },
      {
        phoneNumber: '09123333333',
        firstName: 'Customer',
        lastName: 'User',
        role: 'customer'
      },
      // Additional store users for the 4 stores
      {
        phoneNumber: '09166666666',
        firstName: 'Tehran',
        lastName: 'Mall',
        role: 'store'
      },
      {
        phoneNumber: '09177777777',
        firstName: 'Isfahan',
        lastName: 'Bazaar',
        role: 'store'
      },
      {
        phoneNumber: '09221234567',
        firstName: 'Shiraz',
        lastName: 'Market',
        role: 'store'
      },
      // Additional customer users for testing
      {
        phoneNumber: '09111111111',
        firstName: 'Ali',
        lastName: 'Ahmadi',
        role: 'customer'
      },
      {
        phoneNumber: '09133333333',
        firstName: 'Reza',
        lastName: 'Mohammadi',
        role: 'customer'
      },
      {
        phoneNumber: '09144444444',
        firstName: 'Narges',
        lastName: 'Hashemi',
        role: 'customer'
      },
      {
        phoneNumber: '09155555555',
        firstName: 'Amir',
        lastName: 'Hosseini',
        role: 'customer'
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
