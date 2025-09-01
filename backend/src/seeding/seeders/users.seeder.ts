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
      // Required users with specific phone numbers
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
      // Additional sample users
      {
        phoneNumber: '09111111111',
        firstName: 'Ali',
        lastName: 'Ahmadi'
      },
      {
        phoneNumber: '09133333333',
        firstName: 'Reza',
        lastName: 'Mohammadi'
      },
      {
        phoneNumber: '09144444444',
        firstName: 'Narges',
        lastName: 'Hashemi'
      },
      {
        phoneNumber: '09155555555',
        firstName: 'Amir',
        lastName: 'Hosseini'
      },
      {
        phoneNumber: '09166666666',
        firstName: 'Store',
        lastName: 'One',
        role: 'store'
      },
      {
        phoneNumber: '09177777777',
        firstName: 'Store',
        lastName: 'Two',
        role: 'store'
      },
      {
        phoneNumber: '09221234567',
        firstName: 'Store',
        lastName: 'Manager',
        role: 'store'
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
