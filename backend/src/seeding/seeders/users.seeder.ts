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
      {
        phoneNumber: '09111111111',
        firstName: 'Ali',
        lastName: 'Ahmadi',
        totalPoints: 1250,
        purchases: []
      },
      {
        phoneNumber: '09122222222',
        firstName: 'Sara',
        lastName: 'Karimi',
        totalPoints: 850,
        purchases: []
      },
      {
        phoneNumber: '09133333333',
        firstName: 'Reza',
        lastName: 'Mohammadi',
        totalPoints: 2100,
        purchases: []
      },
      {
        phoneNumber: '09144444444',
        firstName: 'Narges',
        lastName: 'Hashemi',
        totalPoints: 450,
        purchases: []
      },
      {
        phoneNumber: '09155555555',
        firstName: 'Amir',
        lastName: 'Hosseini',
        totalPoints: 1800,
        purchases: []
      },
      {
        phoneNumber: '09166666666',
        firstName: 'Store',
        lastName: 'One',
        totalPoints: 0,
        role: 'store',
        purchases: []
      },
      {
        phoneNumber: '09177777777',
        firstName: 'Store',
        lastName: 'Two',
        totalPoints: 0,
        role: 'store',
        purchases: []
      },
      {
        phoneNumber: '09111234567',
        firstName: 'Admin',
        lastName: 'User',
        totalPoints: 0,
        role: 'admin',
        purchases: []
      },
      {
        phoneNumber: '09221234567',
        firstName: 'Store',
        lastName: 'Manager',
        totalPoints: 0,
        role: 'store',
        purchases: []
      },
      {
        phoneNumber: '09331234567',
        firstName: 'Customer',
        lastName: 'User',
        totalPoints: 500,
        role: 'customer',
        purchases: []
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
