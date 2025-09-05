import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PromoCode, PromoCodeDocument } from '../schemas/promoCode.schema';
import { Promotion, PromotionDocument } from '../schemas/promotion.schema';
import { Store, StoreDocument } from '../schemas/store.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { 
  CreatePromoCodeDto, 
  UpdatePromoCodeDto, 
  ChangePromoCodeStatusDto,
  ValidatePromoCodeDto,
  PromoCodeResponseDto,
  PromoCodeValidationResponseDto,
  BulkCreatePromoCodesDto,
  PromoCodeListResponseDto,
  UserPromoCodesResponseDto,
  RegisterWithPromoCodeDto,
  VerifyPromoRegistrationDto,
  PromoRegistrationResponseDto
} from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { 
  StoreNotFoundException,
  CustomConflictException 
} from '../common/errors';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private otpService: OtpService,
  ) {}

  private transformPromoCodeToResponse(promoCode: PromoCodeDocument): PromoCodeResponseDto {
    // Type assertion for populated fields
    const populatedPromoCode = promoCode as PromoCodeDocument & {
      promotionId: any;
      userId?: any;
    };

    return {
      id: promoCode._id.toString(),
      code: promoCode.code,
      promotionId: populatedPromoCode.populated('promotionId') 
        ? populatedPromoCode.promotionId._id.toString()
        : promoCode.promotionId.toString(),
      status: promoCode.status,
      userId: populatedPromoCode.populated('userId') 
        ? populatedPromoCode.userId._id.toString()
        : promoCode.userId?.toString(),
      registeredAt: promoCode.registeredAt,
      usedAt: promoCode.usedAt,
      notes: promoCode.notes,
      createdAt: promoCode.createdAt,
      updatedAt: promoCode.updatedAt,
      // Include populated promotion data
      promotion: populatedPromoCode.populated('promotionId') ? {
        id: populatedPromoCode.promotionId._id.toString(),
        title: populatedPromoCode.promotionId.title,
        price: populatedPromoCode.promotionId.price,
        points: populatedPromoCode.promotionId.points,
        status: populatedPromoCode.promotionId.status,
      } : undefined,
      // Include populated user data
      user: populatedPromoCode.populated('userId') && populatedPromoCode.userId ? {
        id: populatedPromoCode.userId._id.toString(),
        phoneNumber: populatedPromoCode.userId.phoneNumber,
        firstName: populatedPromoCode.userId.firstName,
        lastName: populatedPromoCode.userId.lastName,
      } : undefined,
    };
  }

  async create(createPromoCodeDto: CreatePromoCodeDto, user: any): Promise<PromoCodeResponseDto> {
    // Verify promotion exists and belongs to user's store
    const promotion = await this.promotionModel.findById(createPromoCodeDto.promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Check if user has access to this promotion's store
    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    // Admin users can create promo codes for any promotion
    if (user.role === 'admin') {
      // Allow admin access
    } else if (store.userId.toString() !== user._id.toString()) {
      // Store users can only create promo codes for their own promotions
      throw new ForbiddenException('You do not have permission to create promo codes for this promotion');
    }

    // Check if code already exists
    const existingCode = await this.promoCodeModel.findOne({ code: createPromoCodeDto.code }).exec();
    if (existingCode) {
      throw new CustomConflictException('Promo code already exists');
    }

    const promoCode = new this.promoCodeModel({
      ...createPromoCodeDto,
      promotionId: new Types.ObjectId(createPromoCodeDto.promotionId)
    });
    const savedPromoCode = await promoCode.save();
    
    return this.transformPromoCodeToResponse(savedPromoCode);
  }

  async findAll(listRequest: ListRequestDto, user: any, additionalFilters: any = {}): Promise<PromoCodeListResponseDto> {
    const { page = 1, limit = 10, search, sort = [{ field: 'createdAt', direction: 'desc' }] } = listRequest;
    const skip = (page - 1) * limit;

    // Build query - admin users can see all promo codes, store users only see their own
    // Exclude deleted promo codes from all queries
    let query: any = { status: { $ne: 'deleted' } };

    // Apply additional filters first (like promotionId)
    if (additionalFilters.promotionId) {
      query.promotionId = additionalFilters.promotionId;
    }

    // For store users, filter by their stores only (only if not already filtered by promotionId)
    if (user.role === 'store' && !additionalFilters.promotionId) {
      const userStores = await this.storeModel.find({ userId: user._id }).select('_id').exec();
      const storeIds = userStores.map(store => store._id);
      
      const promotions = await this.promotionModel.find({ storeId: { $in: storeIds } }).select('_id').exec();
      const promotionIds = promotions.map(promotion => promotion._id);
      
      query.promotionId = { $in: promotionIds };
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const sortObj: any = {};
    if (sort && sort.length > 0) {
      sort.forEach(s => {
        sortObj[s.field] = s.direction === 'desc' ? -1 : 1;
      });
    } else {
      sortObj.createdAt = -1;
    }

    const [promoCodes, total] = await Promise.all([
      this.promoCodeModel
        .find(query)
        .populate('promotionId', 'title price points status')
        .populate('userId', 'phoneNumber firstName lastName')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.promoCodeModel.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: promoCodes.map(promoCode => this.transformPromoCodeToResponse(promoCode)),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async findOne(id: string, user: any): Promise<PromoCodeResponseDto> {
    const promoCode = await this.promoCodeModel
      .findById(id)
      .populate('promotionId', 'title price points status')
      .populate('userId', 'phoneNumber firstName lastName')
      .exec();
    
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    // Verify user has access to this promo code's promotion
    const promotion = await this.promotionModel.findById(promoCode.promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Associated promotion not found');
    }

    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    // Admin users can access any promo code
    if (user.role === 'admin') {
      // Allow admin access
    } else if (store.userId.toString() !== user._id.toString()) {
      // Store users can only access promo codes for their own promotions
      throw new ForbiddenException('You do not have permission to access this promo code');
    }

    return this.transformPromoCodeToResponse(promoCode);
  }

  async update(id: string, updatePromoCodeDto: UpdatePromoCodeDto, user: any): Promise<PromoCodeResponseDto> {
    const promoCode = await this.promoCodeModel.findById(id).exec();
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    // Verify user has access to this promo code's promotion
    const promotion = await this.promotionModel.findById(promoCode.promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Associated promotion not found');
    }

    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    // Admin users can update any promo code
    if (user.role === 'admin') {
      // Allow admin access
    } else if (store.userId.toString() !== user._id.toString()) {
      // Store users can only update promo codes for their own promotions
      throw new ForbiddenException('You do not have permission to update this promo code');
    }

    // Prevent updating used codes
    if (promoCode.status === 'used') {
      throw new BadRequestException('Cannot update used promo codes');
    }

    const updatedPromoCode = await this.promoCodeModel
      .findByIdAndUpdate(id, updatePromoCodeDto, { new: true })
      .populate('promotionId', 'title price points status')
      .populate('userId', 'phoneNumber firstName lastName')
      .exec();

    if (!updatedPromoCode) {
      throw new NotFoundException('Promo code not found');
    }

    return this.transformPromoCodeToResponse(updatedPromoCode);
  }

  async updateStatus(id: string, changeStatusDto: ChangePromoCodeStatusDto, user: any): Promise<PromoCodeResponseDto> {
    const promoCode = await this.promoCodeModel.findById(id).exec();
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    // Verify user has access to this promo code's promotion
    const promotion = await this.promotionModel.findById(promoCode.promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Associated promotion not found');
    }

    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    // Admin users can update status of any promo code
    if (user.role === 'admin') {
      // Allow admin access
    } else if (store.userId.toString() !== user._id.toString()) {
      // Store users can only update promo codes for their own promotions
      throw new ForbiddenException('You do not have permission to update this promo code');
    }

    // Validate status transition
    if (promoCode.status === 'used' && changeStatusDto.status !== 'used') {
      throw new BadRequestException('Cannot change status of a used promo code');
    }

    // Validate required fields for status change
    if (changeStatusDto.status === 'used') {
      // Check if code is registered to a user
      if (!promoCode.userId) {
        throw new BadRequestException('Code must be registered to a user before it can be marked as used');
      }

      // If userId is provided, verify it matches the registered user
      if (changeStatusDto.userId && promoCode.userId.toString() !== changeStatusDto.userId) {
        throw new BadRequestException('User ID does not match the registered user for this code');
      }

      // Check if transaction already exists for this promo code
      const existingTransaction = await this.transactionModel.findOne({
        promoCodeId: promoCode._id
      }).exec();

      if (existingTransaction) {
        throw new BadRequestException('Transaction already exists for this promo code');
      }

      // Create transaction when promo code is marked as used
      const transaction = new this.transactionModel({
        customerId: promoCode.userId,
        storeId: promotion.storeId,
        promoCodeId: promoCode._id,
        promotionId: promotion._id,
      });

      await transaction.save();
    }

    const updateData: any = { status: changeStatusDto.status };
    
    if (changeStatusDto.status === 'used') {
      updateData.usedAt = new Date();
    }

    const updatedPromoCode = await this.promoCodeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('promotionId', 'title price points status')
      .populate('userId', 'phoneNumber firstName lastName')
      .exec();

    if (!updatedPromoCode) {
      throw new NotFoundException('Promo code not found');
    }

    return this.transformPromoCodeToResponse(updatedPromoCode);
  }

  async validateCode(validateDto: ValidatePromoCodeDto, user: any): Promise<PromoCodeValidationResponseDto> {
    const { code, storeId } = validateDto;

    // Find the promo code
    const promoCode = await this.promoCodeModel.findOne({ code }).exec();
    if (!promoCode) {
      return {
        isValid: false,
        message: 'Promo code not found',
        errorCode: 'CODE_NOT_FOUND'
      };
    }

    // Check if code is deleted
    if (promoCode.status === 'deleted') {
      return {
        isValid: false,
        message: 'Promo code has been deleted',
        errorCode: 'CODE_DELETED'
      };
    }

    // Check if code is already used
    if (promoCode.status === 'used') {
      return {
        isValid: false,
        message: 'Promo code has already been used',
        errorCode: 'CODE_ALREADY_USED'
      };
    }

    // Check if code is registered to a user
    if (!promoCode.userId) {
      return {
        isValid: false,
        message: 'Promo code must be registered to a user before it can be used',
        errorCode: 'CODE_NOT_REGISTERED'
      };
    }

    // Find the associated promotion
    const promotion = await this.promotionModel.findById(promoCode.promotionId).exec();
    if (!promotion) {
      return {
        isValid: false,
        message: 'Associated promotion not found',
        errorCode: 'PROMOTION_NOT_FOUND'
      };
    }

    // Check if promotion is active
    if (promotion.status !== 'active') {
      let errorMessage = 'Promotion is not active';
      let errorCode = 'PROMOTION_INACTIVE';
      
      // Provide specific error messages for different promotion statuses
      switch (promotion.status) {
        case 'expired':
          errorMessage = 'Promotion has expired';
          errorCode = 'PROMOTION_EXPIRED';
          break;
        case 'deleted':
          errorMessage = 'Promotion has been deleted';
          errorCode = 'PROMOTION_DELETED';
          break;
        case 'inactive':
          errorMessage = 'Promotion is currently inactive';
          errorCode = 'PROMOTION_INACTIVE';
          break;
        default:
          errorMessage = 'Promotion is not active';
          errorCode = 'PROMOTION_INACTIVE';
      }
      
      return {
        isValid: false,
        message: errorMessage,
        errorCode: errorCode
      };
    }

    // Check if promotion belongs to the requesting store
    if (promotion.storeId.toString() !== storeId) {
      return {
        isValid: false,
        message: 'Promo code is not valid for this store',
        errorCode: 'INVALID_STORE'
      };
    }

    // For store users, ensure they can only validate codes for their own store
    if (user.role === 'store' && user.storeId !== storeId) {
      return {
        isValid: false,
        message: 'You can only validate promo codes for your own store',
        errorCode: 'FORBIDDEN_STORE'
      };
    }

    // Return successful validation with promo code and promotion details
    return {
      isValid: true,
      promoCode: this.transformPromoCodeToResponse(promoCode),
      promotion: {
        id: promotion._id.toString(),
        title: promotion.title,
        description: promotion.description,
        price: promotion.price,
        points: promotion.points,
        status: promotion.status,
      },
      message: 'Promo code is valid'
    };
  }

  async bulkCreate(bulkCreateDto: BulkCreatePromoCodesDto, user: any): Promise<PromoCodeResponseDto[]> {
    const { promotionId, count = 1, prefix, expiresAt, notes } = bulkCreateDto;

    // Verify promotion exists and belongs to user's store
    const promotion = await this.promotionModel.findById(promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    // Admin users can create promo codes for any promotion
    if (user.role === 'admin') {
      // Allow admin access
    } else if (store.userId.toString() !== user._id.toString()) {
      // Store users can only create promo codes for their own promotions
      throw new ForbiddenException('You do not have permission to create promo codes for this promotion');
    }

    // Validate count
    if (count < 1 || count > 1000) {
      throw new BadRequestException('Count must be between 1 and 1000');
    }

    // Calculate suffix length based on prefix and total code length
    const minSuffixLength = 4; // Minimum suffix length for uniqueness
    const maxTotalLength = 12; // Maximum total code length
    
    // If prefix is provided, ensure we have enough space for suffix
    let suffixLength = minSuffixLength;
    if (prefix) {
      const availableSpace = maxTotalLength - prefix.length;
      if (availableSpace < minSuffixLength) {
        throw new BadRequestException(`Prefix is too long. Maximum prefix length is ${maxTotalLength - minSuffixLength} characters to allow for unique suffix`);
      }
      suffixLength = availableSpace;
    }
    const codesToCreate: any[] = [];

    // Generate unique codes
    for (let i = 0; i < count; i++) {
      let code: string | undefined;
      let isUnique = false;
      let attempts = 0;

      // Generate unique code (max 10 attempts to avoid infinite loop)
      while (!isUnique && attempts < 10) {
        code = this.generatePromoCodeWithPrefix(prefix, suffixLength);
        const existingCode = await this.promoCodeModel.findOne({ code }).exec();
        if (!existingCode) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique || !code) {
        throw new BadRequestException('Unable to generate unique promo codes. Please try again.');
      }

      codesToCreate.push({
        code,
        promotionId: new Types.ObjectId(promotionId),
        expiresAt,
        notes,
      });
    }

    // Create all codes
    const createdCodes = await this.promoCodeModel.insertMany(codesToCreate);
    
    return createdCodes.map(code => this.transformPromoCodeToResponse(code as PromoCodeDocument));
  }

  async remove(id: string, user: any): Promise<void> {
    const promoCode = await this.promoCodeModel.findById(id).exec();
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    // Verify user has access to this promo code's promotion
    const promotion = await this.promotionModel.findById(promoCode.promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Associated promotion not found');
    }

    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    // Admin users can delete promo codes for any promotion
    if (user.role === 'admin') {
      // Allow admin access
    } else if (store.userId.toString() !== user._id.toString()) {
      // Store users can only delete promo codes for their own promotions
      throw new ForbiddenException('You do not have permission to delete this promo code');
    }

    // Prevent deletion of used codes
    if (promoCode.status === 'used') {
      throw new BadRequestException('Cannot delete used promo codes');
    }

    await this.promoCodeModel.findByIdAndDelete(id).exec();
  }

  private generatePromoCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generatePromoCodeWithPrefix(prefix?: string, suffixLength: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    
    // Generate random suffix
    for (let i = 0; i < suffixLength; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Combine prefix and suffix
    return prefix ? `${prefix}${suffix}` : suffix;
  }

  async registerCodeToUser(code: string, phoneNumber: string): Promise<PromoCodeResponseDto> {
    // Find the promo code
    const promoCode = await this.promoCodeModel.findOne({ code }).exec();
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    // Check if code is deleted
    if (promoCode.status === 'deleted') {
      throw new BadRequestException('Promo code has been deleted');
    }

    // Check if code is already used
    if (promoCode.status === 'used') {
      throw new BadRequestException('Promo code has already been used');
    }

    // Check if code is already registered to a user
    if (promoCode.userId) {
      throw new BadRequestException('Promo code has already been registered to a user');
    }

    // Find the user by phone number
    const user = await this.userModel.findOne({ phoneNumber }).exec();
    if (!user) {
      throw new NotFoundException('User not found with this phone number');
    }

    // Find the associated promotion to validate it's still active
    const promotion = await this.promotionModel.findById(promoCode.promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Associated promotion not found');
    }

    // Check promotion status with specific error messages
    if (promotion.status !== 'active') {
      let errorMessage = 'Promotion is not active';
      
      switch (promotion.status) {
        case 'expired':
          errorMessage = 'Promotion has expired';
          break;
        case 'deleted':
          errorMessage = 'Promotion has been deleted';
          break;
        case 'inactive':
          errorMessage = 'Promotion is currently inactive';
          break;
        default:
          errorMessage = 'Promotion is not active';
      }
      
      throw new BadRequestException(errorMessage);
    }

    // Register the code to the user (status remains 'unused')
    promoCode.userId = user._id;
    promoCode.registeredAt = new Date();
    const updatedPromoCode = await promoCode.save();

    // Populate the data before transforming
    const populatedPromoCode = await this.promoCodeModel
      .findById(updatedPromoCode._id)
      .populate('promotionId', 'title price points status')
      .populate('userId', 'phoneNumber firstName lastName')
      .exec();

    if (!populatedPromoCode) {
      throw new NotFoundException('Promo code not found after registration');
    }

    return this.transformPromoCodeToResponse(populatedPromoCode);
  }

  async getUserPromoCodes(phoneNumber: string, storeId?: string, requestingUser?: any): Promise<UserPromoCodesResponseDto> {
    // Find the user by phone number
    const targetUser = await this.userModel.findOne({ phoneNumber }).exec();
    if (!targetUser) {
      throw new NotFoundException('User not found with this phone number');
    }

    // For store users, ensure they can only access promo codes from their own store
    if (requestingUser?.role === 'store' && storeId) {
      // Find the store that belongs to this user
      const userStore = await this.storeModel.findOne({ userId: requestingUser._id }).exec();
      
      if (!userStore) {
        throw new ForbiddenException('Store not found for this user');
      }
      
      // Compare store IDs using string comparison
      const userStoreId = userStore._id.toString();
      if (userStoreId !== storeId) {
        throw new ForbiddenException('You can only access promo codes from your own store');
      }
    }

    // Build query for user's promo codes
    let query: any = { userId: targetUser._id, status: { $ne: 'deleted' } };

    // If storeId is provided, filter by promotions belonging to that store
    if (storeId) {
      const promotions = await this.promotionModel.find({ storeId: new Types.ObjectId(storeId) }).select('_id').exec();
      const promotionIds = promotions.map(promotion => promotion._id);
      query.promotionId = { $in: promotionIds };
    }

    // Get promo codes with promotion details
    const promoCodes = await this.promoCodeModel
      .find(query)
      .populate('promotionId', 'title price points status')
      .populate('userId', 'phoneNumber firstName lastName')
      .sort({ createdAt: -1 })
      .exec();

    const transformedPromoCodes = promoCodes.map(promoCode => this.transformPromoCodeToResponse(promoCode));
    
    // Determine message based on results
    let message: string;
    if (transformedPromoCodes.length === 0) {
      message = 'این مشتری کد تخفیف استفاده نشده‌ای ندارد';
    } else {
      message = `${transformedPromoCodes.length} کد تخفیف برای این مشتری یافت شد`;
    }

    return {
      data: transformedPromoCodes,
      message,
      total: transformedPromoCodes.length,
      phoneNumber
    };
  }

  async getStats(promotionId?: string, user?: any): Promise<{
    total: number;
    unused: number;
    used: number;
    registered: number;
    deleted: number;
  }> {
    let query: any = { status: { $ne: 'deleted' } };

    // For store users, filter by their stores only
    if (user && user.role === 'store') {
      const userStores = await this.storeModel.find({ userId: user._id }).select('_id').exec();
      const storeIds = userStores.map(store => store._id);
      
      const promotions = await this.promotionModel.find({ storeId: { $in: storeIds } }).select('_id').exec();
      const promotionIds = promotions.map(promotion => promotion._id);
      
      query.promotionId = { $in: promotionIds };
    }

    // If specific promotion ID is provided
    if (promotionId) {
      query.promotionId = new Types.ObjectId(promotionId);
    }

    const [total, unused, used, registered, deleted] = await Promise.all([
      this.promoCodeModel.countDocuments(query).exec(),
      this.promoCodeModel.countDocuments({ ...query, status: 'unused', userId: { $exists: false } }).exec(),
      this.promoCodeModel.countDocuments({ ...query, status: 'used' }).exec(),
      this.promoCodeModel.countDocuments({ ...query, status: 'unused', userId: { $exists: true } }).exec(),
      this.promoCodeModel.countDocuments({ ...query, status: 'deleted' }).exec(),
    ]);

    return { total, unused, used, registered, deleted };
  }

  /**
   * Step 1: Send OTP for promo code registration
   */
  async sendOtpForPromoRegistration(registerDto: RegisterWithPromoCodeDto): Promise<{ message: string; otpId: string }> {
    // Validate promo code exists and is available
    const promoCode = await this.promoCodeModel.findOne({ 
      code: registerDto.promoCode,
      status: 'unused'
    }).populate('promotionId').exec();

    if (!promoCode) {
      throw new NotFoundException('کد تخفیف یافت نشد یا قبلاً استفاده شده است');
    }

    // Check if promotion is active
    const promotion = promoCode.promotionId as any;
    if (promotion.status !== 'active') {
      throw new BadRequestException('این پیشنهاد فعال نیست');
    }

    // Check if there's already an active OTP for this phone number
    const existingOtp = await this.otpService.findActiveByPhoneNumber(registerDto.phoneNumber, 'promo-registration');
    if (existingOtp) {
      throw new BadRequestException('کد تأیید قبلاً ارسال شده است. لطفاً منتظر بمانید');
    }

    // Create OTP with fixed code 123456
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const otp = await this.otpService.create({
      phoneNumber: registerDto.phoneNumber,
      code: '123456', // Fixed value as requested
      context: 'promo-registration',
      expiresAt: expiresAt.toISOString()
    });

    return {
      message: 'کد تأیید ارسال شد',
      otpId: otp.id
    };
  }

  /**
   * Step 2: Verify OTP and complete promo code registration
   */
  async verifyPromoRegistration(verifyDto: VerifyPromoRegistrationDto): Promise<PromoRegistrationResponseDto> {
    // Verify OTP
    try {
      await this.otpService.verifyOtp(verifyDto.phoneNumber, verifyDto.otpCode, 'promo-registration');
    } catch (error) {
      throw new BadRequestException('کد تأیید نامعتبر یا منقضی شده است');
    }

    // Find promo code and validate
    const promoCode = await this.promoCodeModel.findOne({ 
      code: verifyDto.promoCode,
      status: 'unused'
    }).populate('promotionId').exec();

    if (!promoCode) {
      throw new NotFoundException('کد تخفیف یافت نشد یا قبلاً استفاده شده است');
    }

    const promotion = promoCode.promotionId as any;
    if (promotion.status !== 'active') {
      throw new BadRequestException('این پیشنهاد فعال نیست');
    }

    // Get store information
    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store) {
      throw new NotFoundException('فروشگاه یافت نشد');
    }

    // Check if user exists
    let user = await this.userModel.findOne({ phoneNumber: verifyDto.phoneNumber }).exec();
    
    if (!user) {
      // Create new user as customer
      user = new this.userModel({
        phoneNumber: verifyDto.phoneNumber,
        role: 'customer',
        status: 'active',
        lastActivity: new Date()
      });
      await user.save();
    }

    // Register promo code for user
    promoCode.userId = user._id;
    promoCode.registeredAt = new Date();
    await promoCode.save();

    // Create transaction record
    const transaction = new this.transactionModel({
      customerId: user._id,
      storeId: store._id,
      promoCodeId: promoCode._id,
      promotionId: promotion._id
    });
    await transaction.save();

    return {
      message: 'تبریک! شما با موفقیت در برنامه وفاداری ثبت نام کردید',
      user: {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt
      },
      store: {
        id: store._id.toString(),
        name: store.name,
        phoneNumber: store.phoneNumber,
        address: store.address,
        logoUrl: store.logoUrl,
        description: store.description,
        socialLinks: store.socialLinks,
        workingHours: store.workingHours
      },
      promotion: {
        id: promotion._id.toString(),
        title: promotion.title,
        description: promotion.description,
        price: promotion.price,
        points: promotion.points,
        status: promotion.status
      },
      promoCode: {
        id: promoCode._id.toString(),
        code: promoCode.code,
        status: promoCode.status,
        registeredAt: promoCode.registeredAt,
        notes: promoCode.notes
      },
      transaction: {
        id: transaction._id.toString(),
        createdAt: transaction.createdAt
      }
    };
  }
}
