import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sms, SmsDocument } from '../schemas/sms.schema';

export interface SendSmsDto {
  userId: string;
  text: string;
  createdBy: string;
}

export interface SmsResponseDto {
  id: string;
  userId: string;
  providerResponse: string;
  text: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SmsService {
  constructor(
    @InjectModel(Sms.name) private smsModel: Model<SmsDocument>,
  ) {}

  private transformSmsToResponse(sms: SmsDocument): SmsResponseDto {
    return {
      id: sms._id.toString(),
      userId: sms.userId.toString(),
      providerResponse: sms.providerResponse,
      text: sms.text,
      createdBy: sms.createdBy.toString(),
      createdAt: sms.createdAt,
      updatedAt: sms.updatedAt,
    };
  }

  async sendSms(sendSmsDto: SendSmsDto): Promise<SmsResponseDto> {
    // For now, just log the SMS instead of sending it
    const mockProviderResponse = 'SMS logged successfully (mock provider)';
    
    // Log to console for development
    console.log('📱 SMS Log:', {
      to: sendSmsDto.userId,
      text: sendSmsDto.text,
      requestedBy: sendSmsDto.createdBy,
      timestamp: new Date().toISOString(),
      providerResponse: mockProviderResponse
    });

    // Create SMS record in database
    const sms = new this.smsModel({
      userId: new Types.ObjectId(sendSmsDto.userId),
      providerResponse: mockProviderResponse,
      text: sendSmsDto.text,
      createdBy: new Types.ObjectId(sendSmsDto.createdBy),
    });

    const savedSms = await sms.save();
    return this.transformSmsToResponse(savedSms);
  }

  async findAll(): Promise<SmsResponseDto[]> {
    const smsList = await this.smsModel
      .find()
      .populate('userId', 'phoneNumber firstName lastName')
      .populate('createdBy', 'phoneNumber firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
    
    return smsList.map(sms => this.transformSmsToResponse(sms));
  }

  async findById(id: string): Promise<SmsResponseDto> {
    const sms = await this.smsModel
      .findById(id)
      .populate('userId', 'phoneNumber firstName lastName')
      .populate('createdBy', 'phoneNumber firstName lastName')
      .exec();
    
    if (!sms) {
      throw new Error('SMS not found');
    }
    
    return this.transformSmsToResponse(sms);
  }

  async findByUserId(userId: string): Promise<SmsResponseDto[]> {
    const smsList = await this.smsModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'phoneNumber firstName lastName')
      .populate('createdBy', 'phoneNumber firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
    
    return smsList.map(sms => this.transformSmsToResponse(sms));
  }

  async getSmsStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, todayCount, weekCount, monthCount] = await Promise.all([
      this.smsModel.countDocuments().exec(),
      this.smsModel.countDocuments({ createdAt: { $gte: today } }).exec(),
      this.smsModel.countDocuments({ createdAt: { $gte: weekAgo } }).exec(),
      this.smsModel.countDocuments({ createdAt: { $gte: monthAgo } }).exec(),
    ]);

    return {
      total,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
    };
  }
}
