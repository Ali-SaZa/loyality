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
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
