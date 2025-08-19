import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../schemas/otp.schema';
import { CreateOtpDto, UpdateOtpDto, OtpResponseDto } from '../dto';
import { 
  OTPNotFoundException,
  InvalidOTPException
} from '../common/errors';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {}

  private transformOtpToResponse(otp: OtpDocument): OtpResponseDto {
    return {
      id: otp._id.toString(),
      phoneNumber: otp.phoneNumber,
      userId: otp.userId?.toString(),
      code: otp.code,
      context: otp.context,
      scratchCode: otp.scratchCode,
      status: otp.status,
      expiresAt: otp.expiresAt,
      createdAt: otp.createdAt,
      updatedAt: otp.updatedAt,
    };
  }

  async create(createOtpDto: CreateOtpDto): Promise<OtpResponseDto> {
    const otp = new this.otpModel(createOtpDto);
    const savedOtp = await otp.save();
    return this.transformOtpToResponse(savedOtp);
  }

  async findAll(): Promise<OtpResponseDto[]> {
    const otps = await this.otpModel.find().exec();
    return otps.map(otp => this.transformOtpToResponse(otp));
  }

  async findOne(id: string): Promise<OtpResponseDto> {
    const otp = await this.otpModel.findById(id).exec();
    if (!otp) {
      throw new OTPNotFoundException();
    }
    return this.transformOtpToResponse(otp);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<OtpResponseDto[]> {
    const otps = await this.otpModel.find({ phoneNumber }).exec();
    return otps.map(otp => this.transformOtpToResponse(otp));
  }

  async findActiveByPhoneNumber(phoneNumber: string, context: 'login' | 'scratch'): Promise<OtpResponseDto | null> {
    const otp = await this.otpModel.findOne({
      phoneNumber,
      context,
      status: 'sent',
      expiresAt: { $gt: new Date() }
    }).exec();
    
    return otp ? this.transformOtpToResponse(otp) : null;
  }

  async findRecentOtp(phoneNumber: string, context: 'login' | 'scratch'): Promise<OtpResponseDto | null> {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    const otp = await this.otpModel.findOne({
      phoneNumber,
      context,
      createdAt: { $gt: twoMinutesAgo }
    }).sort({ createdAt: -1 }).exec();
    
    return otp ? this.transformOtpToResponse(otp) : null;
  }

  async update(id: string, updateOtpDto: UpdateOtpDto): Promise<OtpResponseDto> {
    const otp = await this.otpModel
      .findByIdAndUpdate(id, updateOtpDto, { new: true })
      .exec();
    
    if (!otp) {
      throw new OTPNotFoundException();
    }
    
    return this.transformOtpToResponse(otp);
  }

  async updateStatus(id: string, status: 'sent' | 'verified' | 'expired'): Promise<OtpResponseDto> {
    const otp = await this.otpModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    
    if (!otp) {
      throw new OTPNotFoundException();
    }
    
    return this.transformOtpToResponse(otp);
  }

  async verifyOtp(phoneNumber: string, code: string, context: 'login' | 'scratch'): Promise<OtpResponseDto> {
    const otp = await this.otpModel.findOne({
      phoneNumber,
      code,
      context,
      status: 'sent',
      expiresAt: { $gt: new Date() }
    }).exec();
    
    if (!otp) {
      throw new InvalidOTPException();
    }
    
    otp.status = 'verified';
    const savedOtp = await otp.save();
    
    return this.transformOtpToResponse(savedOtp);
  }

  async expireOtp(id: string): Promise<OtpResponseDto> {
    const otp = await this.otpModel
      .findByIdAndUpdate(id, { status: 'expired' }, { new: true })
      .exec();
    
    if (!otp) {
      throw new OTPNotFoundException();
    }
    
    return this.transformOtpToResponse(otp);
  }

  async remove(id: string): Promise<void> {
    const result = await this.otpModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new OTPNotFoundException();
    }
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.otpModel.deleteMany({
      expiresAt: { $lt: new Date() }
    }).exec();
  }
}
