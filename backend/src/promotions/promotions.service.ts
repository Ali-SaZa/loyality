import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from '../schemas/promotion.schema';
import { Store, StoreDocument } from '../schemas/store.schema';
import { 
  CreatePromotionDto, 
  UpdatePromotionDto, 
  PromotionResponseDto, 
  ChangePromotionStatusDto,
  PromotionListResponseDto 
} from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { 
  StoreNotFoundException,
  CustomConflictException 
} from '../common/errors';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

  private transformPromotionToResponse(promotion: PromotionDocument): PromotionResponseDto {
    return {
      id: promotion._id.toString(),
      storeId: promotion.storeId.toString(),
      type: promotion.type,
      title: promotion.title,
      description: promotion.description,
      value: promotion.value,
      minPurchaseAmount: promotion.minPurchaseAmount,
      maxDiscountAmount: promotion.maxDiscountAmount,
      code: promotion.code,
      points: promotion.points,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      status: promotion.status,
      usageLimit: promotion.usageLimit,
      currentUsageCount: promotion.currentUsageCount,
      maxUsagePerCustomer: promotion.maxUsagePerCustomer,
      isStackable: promotion.isStackable,
      stackableWith: promotion.stackableWith,
      termsAndConditions: promotion.termsAndConditions,
      requiresApproval: promotion.requiresApproval,
      applicableEvents: promotion.applicableEvents,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
    };
  }

  private validatePromotionType(dto: CreatePromotionDto): void {
    switch (dto.type) {
      case 'coupon':
        if (!dto.code) {
          throw new BadRequestException('Code is required for coupon promotions');
        }
        if (!dto.value) {
          throw new BadRequestException('Value is required for coupon promotions');
        }
        break;

      case 'loyaltyPoints':
        if (!dto.points) {
          throw new BadRequestException('Points are required for loyalty point promotions');
        }
        break;

      case 'percentage':
      case 'fixed':
      case 'cashback':
      case 'referral':
        if (!dto.value) {
          throw new BadRequestException('Value is required for this promotion type');
        }
        break;

      case 'conditional':
        if (!dto.value) {
          throw new BadRequestException('Value is required for conditional promotions');
        }
        if (!dto.minPurchaseAmount) {
          throw new BadRequestException('Minimum purchase amount is required for conditional promotions');
        }
        break;

      case 'flashSale':
        if (!dto.value) {
          throw new BadRequestException('Value is required for flash sale promotions');
        }
        if (!dto.startDate) {
          throw new BadRequestException('Start date is required for flash sale promotions');
        }
        if (!dto.endDate) {
          throw new BadRequestException('End date is required for flash sale promotions');
        }
        if (new Date(dto.startDate) >= new Date(dto.endDate)) {
          throw new BadRequestException('End date must be after start date');
        }
        break;

      case 'behavioral':
        if (!dto.value) {
          throw new BadRequestException('Value is required for behavioral promotions');
        }
        if (!dto.applicableEvents || dto.applicableEvents.length === 0) {
          throw new BadRequestException('Applicable events are required for behavioral promotions');
        }
        break;

      case 'stackable':
        if (!dto.value) {
          throw new BadRequestException('Value is required for stackable promotions');
        }
        if (dto.isStackable !== true) {
          throw new BadRequestException('Stackable promotions must have isStackable set to true');
        }
        if (!dto.stackableWith || dto.stackableWith.length === 0) {
          throw new BadRequestException('Stackable promotions must specify which types they can stack with');
        }
        break;

      case 'freeShipping':
        // Free shipping doesn't require value, but can have minPurchaseAmount
        break;

      default:
        throw new BadRequestException(`Invalid promotion type: ${dto.type}`);
    }
  }

  private async validateBusinessRules(dto: CreatePromotionDto): Promise<void> {
    // Validate store exists
    const store = await this.storeModel.findById(dto.storeId).exec();
    if (!store) {
      throw new StoreNotFoundException();
    }

    // Validate promo code uniqueness for coupon type
    if (dto.type === 'coupon' && dto.code) {
      const existingPromotion = await this.promotionModel.findOne({ 
        code: dto.code, 
        status: { $ne: 'deleted' } 
      }).exec();
      
      if (existingPromotion) {
        throw new CustomConflictException('Promo code already exists');
      }
    }

    // Validate date logic
    if (dto.startDate && dto.endDate) {
      if (new Date(dto.startDate) >= new Date(dto.endDate)) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Validate percentage values
    if (dto.type === 'percentage' && dto.value && dto.value > 100) {
      throw new BadRequestException('Percentage value cannot exceed 100%');
    }

    // Validate stackable logic
    if (dto.isStackable && dto.stackableWith) {
      const validTypes = [
        'coupon', 'cashback', 'referral', 'conditional', 'percentage', 
        'fixed', 'flashSale', 'freeShipping', 'loyaltyPoints', 'behavioral', 'stackable'
      ];
      
      for (const type of dto.stackableWith) {
        if (!validTypes.includes(type)) {
          throw new BadRequestException(`Invalid stackable type: ${type}`);
        }
      }
    }
  }

  async create(createPromotionDto: CreatePromotionDto, user: any): Promise<PromotionResponseDto> {
    // Validate type-specific requirements
    this.validatePromotionType(createPromotionDto);
    
    // Validate business rules
    await this.validateBusinessRules(createPromotionDto);

    // Validate user has access to the store
    await this.validateStoreAccess(createPromotionDto.storeId, user);

    // Set default values
    const promotionData = {
      ...createPromotionDto,
      currentUsageCount: 0,
      status: 'active',
      isStackable: createPromotionDto.isStackable || false,
    };

    const promotion = new this.promotionModel(promotionData);
    const savedPromotion = await promotion.save();
    
    return this.transformPromotionToResponse(savedPromotion);
  }

  async findAll(
    request: ListRequestDto, 
    additionalFilters: any = {}
  ): Promise<ListResponseDto<PromotionDocument>> {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const skip = (page - 1) * limit;

    // Add role-based access control
    if (additionalFilters.requestingUser?.role === 'store') {
      // Store users can only see their own store's promotions
      // We need to find the store that belongs to this user
      const userStore = await this.storeModel.findOne({ 
        userId: additionalFilters.requestingUser._id 
      }).exec();
      
      if (userStore) {
        additionalFilters['storeId'] = userStore._id.toString();
      } else {
        // If user has no store, they can't see any promotions
        additionalFilters['storeId'] = null;
      }
    }

    // Build filter query - simplified to only exclude deleted promotions
    let filterQuery: any = { status: { $ne: 'deleted' } };

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.promotionModel
        .find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.promotionModel.countDocuments(filterQuery).exec()
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
      appliedFilters: {
        search: request.search,
        searchFields: request.searchFields,
        sort: request.sort,
        filters: request.filters
      }
    };
  }

  async findOne(id: string, user: any): Promise<PromotionResponseDto> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException('Promotion not found');
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    return this.transformPromotionToResponse(promotion);
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto, user: any): Promise<PromotionResponseDto> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException('Promotion not found');
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Prevent editing of immutable fields - these are not in UpdatePromotionDto anyway
    const allowedUpdates = { ...updatePromotionDto };
    
    // Additional validation for certain fields
    if (allowedUpdates.value && promotion.type === 'percentage' && allowedUpdates.value > 100) {
      throw new BadRequestException('Percentage value cannot exceed 100%');
    }

    const updatedPromotion = await this.promotionModel
      .findByIdAndUpdate(id, allowedUpdates, { new: true })
      .exec();
    
    if (!updatedPromotion) {
      throw new BadRequestException('Promotion not found');
    }
    
    return this.transformPromotionToResponse(updatedPromotion);
  }

  async changeStatus(id: string, changeStatusDto: ChangePromotionStatusDto, user: any): Promise<PromotionResponseDto> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException('Promotion not found');
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Validate status transition
    this.validateStatusTransition(promotion.status, changeStatusDto.status);

    const updatedPromotion = await this.promotionModel
      .findByIdAndUpdate(id, { status: changeStatusDto.status }, { new: true })
      .exec();
    
    if (!updatedPromotion) {
      throw new BadRequestException('Promotion not found');
    }
    
    return this.transformPromotionToResponse(updatedPromotion);
  }

  async remove(id: string, user: any): Promise<void> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException('Promotion not found');
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Soft delete by changing status to 'deleted'
    await this.promotionModel.findByIdAndUpdate(id, { status: 'deleted' }).exec();
  }

  async findByCode(code: string): Promise<PromotionResponseDto | null> {
    const promotion = await this.promotionModel.findOne({ 
      code, 
      status: 'active' 
    }).exec();
    
    return promotion ? this.transformPromotionToResponse(promotion) : null;
  }

  async findByStore(storeId: string, status?: string): Promise<PromotionResponseDto[]> {
    const filter: any = { storeId };
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: 'deleted' };
    }

    const promotions = await this.promotionModel.find(filter).exec();
    return promotions.map(promotion => this.transformPromotionToResponse(promotion));
  }

  private async validateStoreAccess(storeId: string, user: any): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store users can only access their own store's promotions
    if (user.role === 'store') {
      const store = await this.storeModel.findById(storeId).exec();
      if (!store || store.userId.toString() !== user._id.toString()) {
        throw new ForbiddenException('You do not have permission to access this store\'s promotions');
      }
      return;
    }

    throw new ForbiddenException('Insufficient permissions');
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions: { [key: string]: string[] } = {
      'active': ['inactive', 'deleted', 'expired'],
      'inactive': ['active', 'deleted'],
      'expired': ['deleted'],
      'deleted': [] // Cannot transition from deleted
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }
  }

  // Helper method to get promotion statistics
  async getPromotionStats(storeId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    expired: number;
    deleted: number;
  }> {
    const filter = storeId ? { storeId } : {};
    
    const [total, active, inactive, expired, deleted] = await Promise.all([
      this.promotionModel.countDocuments(filter),
      this.promotionModel.countDocuments({ ...filter, status: 'active' }),
      this.promotionModel.countDocuments({ ...filter, status: 'inactive' }),
      this.promotionModel.countDocuments({ ...filter, status: 'expired' }),
      this.promotionModel.countDocuments({ ...filter, status: 'deleted' })
    ]);

    return { total, active, inactive, expired, deleted };
  }
}
