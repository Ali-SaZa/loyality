import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto, PurchaseDto } from '../dto';
import { 
  UserNotFoundException, 
  CustomConflictException 
} from '../common/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async validateUserAccess(userDoc: UserDocument, requestingUser: any): Promise<void> {
    // Admin can access everything
    if (requestingUser.role === 'admin') {
      return;
    }

    // Users can only access their own profile information
    if (requestingUser.role === 'customer' && requestingUser.userId === userDoc._id.toString()) {
      return;
    }

    // Store users can access their own user account
    if (requestingUser.role === 'store' && requestingUser.userId === userDoc._id.toString()) {
      return;
    }

    // Store users can view customer data related to their store
    // This will be validated by checking if the customer has transactions with their store
    if (requestingUser.role === 'store') {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به اطلاعات این کاربر را ندارید.'); // translated to Persian
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ 
      phoneNumber: createUserDto.phoneNumber 
    });
    
    if (existingUser) {
      throw new CustomConflictException('User', 'USER_ALREADY_EXISTS');
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

  async findOne(id: string, requestingUser: any): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    return user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto, requestingUser: any): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    const updatedUser = await this.userModel.findByIdAndUpdate(
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

    if (!updatedUser) {
      throw new UserNotFoundException();
    }
    return updatedUser;
  }

  async remove(id: string, requestingUser: any): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new UserNotFoundException();
    }
  }

  async addPurchase(id: string, purchaseDto: PurchaseDto, requestingUser: any): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

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

  async updateConsents(id: string, dataCollection: boolean, marketing: boolean, requestingUser: any): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    const updatedUser = await this.userModel.findByIdAndUpdate(
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

    if (!updatedUser) {
      throw new UserNotFoundException();
    }
    return updatedUser;
  }
}
