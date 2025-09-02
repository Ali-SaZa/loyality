import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromoCode, PromoCodeDocument } from '../schemas/promoCode.schema';
import { Promotion, PromotionDocument } from '../schemas/promotion.schema';
import { Store, StoreDocument } from '../schemas/store.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { 
  CreatePromoCodeDto, 
  UpdatePromoCodeDto, 
  ChangePromoCodeStatusDto,
  ValidatePromoCodeDto,
  PromoCodeResponseDto,
  PromoCodeValidationResponseDto,
  BulkCreatePromoCodesDto,
  PromoCodeListResponseDto
} from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { 
  StoreNotFoundException,
  CustomConflictException 
} from '../common/errors';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private transformPromoCodeToResponse(promoCode: PromoCodeDocument): PromoCodeResponseDto {
    return {
      id: promoCode._id.toString(),
      code: promoCode.code,
      promotionId: promoCode.promotionId.toString(),
      status: promoCode.status,
      userId: promoCode.userId?.toString(),
      registeredAt: promoCode.registeredAt,
      usedAt: promoCode.usedAt,
      notes: promoCode.notes,
      createdAt: promoCode.createdAt,
      updatedAt: promoCode.updatedAt,
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
    if (!store || store.userId.toString() !== user.id) {
      throw new ForbiddenException('You do not have permission to create promo codes for this promotion');
    }

    // Check if code already exists
    const existingCode = await this.promoCodeModel.findOne({ code: createPromoCodeDto.code }).exec();
    if (existingCode) {
      throw new CustomConflictException('Promo code already exists');
    }

    const promoCode = new this.promoCodeModel(createPromoCodeDto);
    const savedPromoCode = await promoCode.save();
    
    return this.transformPromoCodeToResponse(savedPromoCode);
  }

  async findAll(listRequest: ListRequestDto, user: any, additionalFilters: any = {}): Promise<PromoCodeListResponseDto> {
    const { page = 1, limit = 10, search, sort = [{ field: 'createdAt', direction: 'desc' }] } = listRequest;
    const skip = (page - 1) * limit;

    // Build query - admin users can see all promo codes, store users only see their own
    let query: any = {};

    // Apply additional filters first (like promotionId)
    if (additionalFilters.promotionId) {
      query.promotionId = additionalFilters.promotionId;
    }

    // For store users, filter by their stores only (only if not already filtered by promotionId)
    if (user.role === 'store' && !additionalFilters.promotionId) {
      const userStores = await this.storeModel.find({ userId: user.id }).select('_id').exec();
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
    if (!store || store.userId.toString() !== user.id) {
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
    if (!store || store.userId.toString() !== user.id) {
      throw new ForbiddenException('You do not have permission to update this promo code');
    }

    // Prevent updating used codes
    if (promoCode.status === 'used') {
      throw new BadRequestException('Cannot update used promo codes');
    }

    const updatedPromoCode = await this.promoCodeModel
      .findByIdAndUpdate(id, updatePromoCodeDto, { new: true })
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
    if (!store || store.userId.toString() !== user.id) {
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
    }

    const updateData: any = { status: changeStatusDto.status };
    
    if (changeStatusDto.status === 'used') {
      updateData.usedAt = new Date();
    }

    const updatedPromoCode = await this.promoCodeModel
      .findByIdAndUpdate(id, updateData, { new: true })
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
      return {
        isValid: false,
        message: 'Promotion is not active',
        errorCode: 'PROMOTION_INACTIVE'
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

    // Check promotion status
    if (promotion.status !== 'active') {
      return {
        isValid: false,
        message: 'Promotion is not active',
        errorCode: 'PROMOTION_INACTIVE'
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
    const { promotionId, count = 1, expiresAt, notes } = bulkCreateDto;

    // Verify promotion exists and belongs to user's store
    const promotion = await this.promotionModel.findById(promotionId).exec();
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const store = await this.storeModel.findById(promotion.storeId).exec();
    if (!store || store.userId.toString() !== user.id) {
      throw new ForbiddenException('You do not have permission to create promo codes for this promotion');
    }

    // Validate count
    if (count < 1 || count > 1000) {
      throw new BadRequestException('Count must be between 1 and 1000');
    }

    const promoCodes: PromoCodeResponseDto[] = [];
    const codesToCreate: any[] = [];

    // Generate unique codes
    for (let i = 0; i < count; i++) {
      let code: string | undefined;
      let isUnique = false;
      let attempts = 0;

      // Generate unique code (max 10 attempts to avoid infinite loop)
      while (!isUnique && attempts < 10) {
        code = this.generatePromoCode();
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
        promotionId,
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
    if (!store || store.userId.toString() !== user.id) {
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

  async registerCodeToUser(code: string, phoneNumber: string): Promise<PromoCodeResponseDto> {
    // Find the promo code
    const promoCode = await this.promoCodeModel.findOne({ code }).exec();
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
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

    if (promotion.status !== 'active') {
      throw new BadRequestException('Promotion is not active');
    }

    // Check promotion status
    if (promotion.status !== 'active') {
      throw new BadRequestException('Promotion is not active');
    }

    // Register the code to the user (status remains 'unused')
    promoCode.userId = user._id;
    promoCode.registeredAt = new Date();
    const updatedPromoCode = await promoCode.save();

    return this.transformPromoCodeToResponse(updatedPromoCode);
  }

  async getUserPromoCodes(phoneNumber: string, storeId?: string, requestingUser?: any): Promise<PromoCodeResponseDto[]> {
    // Find the user by phone number
    const targetUser = await this.userModel.findOne({ phoneNumber }).exec();
    if (!targetUser) {
      throw new NotFoundException('User not found with this phone number');
    }

    // For store users, ensure they can only access users related to their store
    if (requestingUser?.role === 'store' && storeId && requestingUser.storeId !== storeId) {
      throw new ForbiddenException('You can only access users related to your own store');
    }

    // Build query for user's promo codes
    let query: any = { userId: targetUser._id };

    // If storeId is provided, filter by promotions belonging to that store
    if (storeId) {
      const promotions = await this.promotionModel.find({ storeId }).select('_id').exec();
      const promotionIds = promotions.map(promotion => promotion._id);
      query.promotionId = { $in: promotionIds };
    }

    // Get promo codes with promotion details
    const promoCodes = await this.promoCodeModel
      .find(query)
      .populate('promotionId', 'title price points status')
      .sort({ createdAt: -1 })
      .exec();

    return promoCodes.map(promoCode => this.transformPromoCodeToResponse(promoCode));
  }

  async getStats(promotionId?: string, user?: any): Promise<{
    total: number;
    unused: number;
    used: number;
    registered: number;
  }> {
    let query: any = {};

    // For store users, filter by their stores only
    if (user && user.role === 'store') {
      const userStores = await this.storeModel.find({ userId: user.id }).select('_id').exec();
      const storeIds = userStores.map(store => store._id);
      
      const promotions = await this.promotionModel.find({ storeId: { $in: storeIds } }).select('_id').exec();
      const promotionIds = promotions.map(promotion => promotion._id);
      
      query.promotionId = { $in: promotionIds };
    }

    // If specific promotion ID is provided
    if (promotionId) {
      query.promotionId = promotionId;
    }

    const [total, unused, used, registered] = await Promise.all([
      this.promoCodeModel.countDocuments(query).exec(),
      this.promoCodeModel.countDocuments({ ...query, status: 'unused', userId: { $exists: false } }).exec(),
      this.promoCodeModel.countDocuments({ ...query, status: 'used' }).exec(),
      this.promoCodeModel.countDocuments({ ...query, status: 'unused', userId: { $exists: true } }).exec(),
    ]);

    return { total, unused, used, registered };
  }
}
