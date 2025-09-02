import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from '../schemas/promotion.schema';
import { Store, StoreDocument } from '../schemas/store.schema';
import { PromoCode, PromoCodeDocument } from '../schemas/promoCode.schema';
import { 
  CreatePromotionDto, 
  UpdatePromotionDto, 
  PromotionResponseDto, 
  ChangePromotionStatusDto,
  PromotionListResponseDto 
} from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { 
  StoreNotFoundException
} from '../common/errors';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCodeDocument>,
  ) {}

  private transformPromotionToResponse(promotion: PromotionDocument): PromotionResponseDto {
    return {
      id: promotion._id.toString(),
      storeId: promotion.storeId.toString(),
      title: promotion.title,
      description: promotion.description,
      price: promotion.price,
      points: promotion.points,
      status: promotion.status,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
    };
  }

  private async validateBusinessRules(dto: CreatePromotionDto): Promise<void> {
    // Validate store exists
    const store = await this.storeModel.findById(dto.storeId).exec();
    if (!store) {
      throw new StoreNotFoundException();
    }

    // Validate price and points are positive
    if (dto.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    if (dto.points <= 0) {
      throw new BadRequestException('Points must be greater than 0');
    }
  }

  async create(createPromotionDto: CreatePromotionDto, user: any): Promise<PromotionResponseDto> {
    // Validate business rules
    await this.validateBusinessRules(createPromotionDto);

    // Validate user has access to the store
    await this.validateStoreAccess(createPromotionDto.storeId, user);

    // Set default values
    const promotionData = {
      ...createPromotionDto,
      status: 'active',
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

    // Add store filter if provided
    if (additionalFilters.storeId) {
      filterQuery.storeId = additionalFilters.storeId;
    }

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.promotionModel
        .find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.promotionModel.countDocuments(filterQuery).exec()
    ]);

    // Convert Mongoose documents to plain objects with transforms applied
    const plainData = data.map(doc => doc.toJSON());

    // Get promo code counts for all promotions in this batch
    const promotionIds = plainData.map(promotion => promotion.id);
    const promoCodeCounts = await this.promoCodeModel.aggregate([
      { $match: { promotionId: { $in: promotionIds } } },
      { $group: { _id: '$promotionId', count: { $sum: 1 } } }
    ]).exec();

    // Create a map of promotion ID to count
    const countMap = new Map();
    promoCodeCounts.forEach(item => {
      countMap.set(item._id.toString(), item.count);
    });

    // Add promo code count to each promotion
    const dataWithCounts = plainData.map(promotion => ({
      ...promotion,
      promoCodeCount: countMap.get(promotion.id) || 0
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: dataWithCounts,
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

    // Additional validation for certain fields
    if (updatePromotionDto.price !== undefined && updatePromotionDto.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    if (updatePromotionDto.points !== undefined && updatePromotionDto.points <= 0) {
      throw new BadRequestException('Points must be greater than 0');
    }

    const updatedPromotion = await this.promotionModel
      .findByIdAndUpdate(id, updatePromotionDto, { new: true })
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

  // Helper method to get promotion with promo code count
  async getPromotionWithCodeCount(id: string, user: any): Promise<PromotionResponseDto & { promoCodeCount: number }> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException('Promotion not found');
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Get promo code count for this promotion
    const promoCodeCount = await this.promoCodeModel.countDocuments({ promotionId: promotion._id }).exec();

    return {
      ...this.transformPromotionToResponse(promotion),
      promoCodeCount
    };
  }
}
