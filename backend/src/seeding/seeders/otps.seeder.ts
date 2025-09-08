import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../../schemas/otp.schema';
import { UserDocument } from '../../schemas/user.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class OTPsSeeder extends BaseSeeder<OtpDocument> {
  private users: UserDocument[] = [];

  constructor(
    @InjectModel(Otp.name) private otpsModel: Model<OtpDocument>
  ) {
    super();
  }

  protected get model(): Model<OtpDocument> {
    return this.otpsModel;
  }

  setUsers(users: UserDocument[]): void {
    this.users = users;
  }

  protected get data(): any[] {
    if (this.users.length === 0) {
      throw new Error('کاربران باید قبل از بذرگذاری کدهای تایید تنظیم شوند'); // translated to Persian
    }

    return this.users.map(user => ({
      phoneNumber: user.phoneNumber,
      userId: user._id,
      code: '123456', // For testing purposes, use fixed OTP code
      context: 'login',
      status: 'sent',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }));
  }

  protected getData(): any[] {
    return this.data;
  }
}
