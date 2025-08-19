import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto, PurchaseDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ 
      phoneNumber: createUserDto.phoneNumber 
    });
    
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const user = new this.userModel({
      ...createUserDto,
      consents: {
        dataCollection: createUserDto.dataCollectionConsent || false,
        marketing: createUserDto.marketingConsent || false,
        consentDate: createUserDto.dataCollectionConsent ? new Date() : undefined,
      },
      lastActivity: new Date(),
    });

    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
        consents: {
          dataCollection: updateUserDto.dataCollectionConsent,
          marketing: updateUserDto.marketingConsent,
          consentDate: updateUserDto.dataCollectionConsent ? new Date() : undefined,
        },
        lastActivity: new Date(),
      },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async addPurchase(id: string, purchaseDto: PurchaseDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate reward based on store settings (simplified for now)
    const rewardApplied = {
      type: 'cashback' as const,
      value: Math.floor(purchaseDto.amount * 0.05), // 5% cashback example
    };

    const purchase = {
      storeId: new Types.ObjectId(purchaseDto.storeId),
      amount: purchaseDto.amount,
      date: new Date(),
      scratchCode: purchaseDto.scratchCode,
      entryMethod: purchaseDto.entryMethod,
      rewardApplied,
    };

    user.purchases.push(purchase);
    user.totalPoints += Math.floor(purchaseDto.amount / 1000); // 1 point per 1000 IRR
    user.lastActivity = new Date();

    return user.save();
  }

  async updateConsents(id: string, dataCollection: boolean, marketing: boolean): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        consents: {
          dataCollection,
          marketing,
          consentDate: dataCollection ? new Date() : undefined,
        },
        lastActivity: new Date(),
      },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
