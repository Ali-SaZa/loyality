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
      throw new Error('Users must be set before seeding OTPs');
    }

    return this.users.map(user => ({
      userId: user._id,
      phoneNumber: user.phoneNumber,
      // code: Math.floor(100000 + Math.random() * 900000).toString(),
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
