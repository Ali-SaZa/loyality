import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Promotion, PromotionDocument } from "../schemas/promotion.schema";
import { Store, StoreDocument } from "../schemas/store.schema";
import { PromoCode, PromoCodeDocument } from "../schemas/promoCode.schema";
import { PERSIAN_ERROR_MESSAGES } from "../common/errors";
import {
  CreatePromotionDto,
  UpdatePromotionDto,
  PromotionResponseDto,
  ChangePromotionStatusDto,
  PromotionListResponseDto,
} from "../dto";
import { ListRequestDto, ListResponseDto } from "../common/dto/list.dto";
import { StoreNotFoundException } from "../common/errors";

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(PromoCode.name)
    private promoCodeModel: Model<PromoCodeDocument>,
  ) {}

  private transformPromotionToResponse(
    promotion: PromotionDocument,
  ): PromotionResponseDto {
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
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_PRICE_INVALID);
    }

    if (dto.points <= 0) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_POINTS_INVALID);
    }
  }

  async create(
    createPromotionDto: CreatePromotionDto,
    user: any,
  ): Promise<PromotionResponseDto> {
    // Validate business rules
    await this.validateBusinessRules(createPromotionDto);

    // Validate user has access to the store
    await this.validateStoreAccess(createPromotionDto.storeId, user);

    // Set default values and convert storeId to ObjectId
    const promotionData = {
      ...createPromotionDto,
      storeId: new Types.ObjectId(createPromotionDto.storeId),
      status: "active",
    };

    const promotion = new this.promotionModel(promotionData);
    const savedPromotion = await promotion.save();

    return this.transformPromotionToResponse(savedPromotion);
  }

  async findAll(
    request: ListRequestDto,
    additionalFilters: any = {},
  ): Promise<ListResponseDto<PromotionDocument>> {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const skip = (page - 1) * limit;

    // Add role-based access control
    if (additionalFilters.requestingUser?.role === "store") {
      // Store users can only see their own store's promotions
      // Use the storeId that's already provided by the authentication guard
      if (additionalFilters.requestingUser.storeId) {
        additionalFilters["storeId"] = additionalFilters.requestingUser.storeId;
      } else {
        // If user has no store, they can't see any promotions
        // Use a non-existent ObjectId to ensure no promotions are returned
        additionalFilters["storeId"] = "000000000000000000000000";
      }
    }

    // Build filter query - include all promotions including deleted ones
    const filterQuery: any = {};

    // Add store filter if provided
    if (additionalFilters.storeId) {
      // Convert string storeId to ObjectId for proper MongoDB query
      filterQuery.storeId = new Types.ObjectId(additionalFilters.storeId);
    }

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.promotionModel
        .find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.promotionModel.countDocuments(filterQuery).exec(),
    ]);

    // Convert Mongoose documents to plain objects with transforms applied
    const plainData = data.map((doc) => doc.toJSON());

    // Get promo code counts for all promotions in this batch
    const promotionIds = plainData.map((promotion) => promotion.id);

    // Debug: Check if there are any promo codes at all
    const totalPromoCodes = await this.promoCodeModel.countDocuments({});
    console.log(`Total promo codes in database: ${totalPromoCodes}`);

    // Simple approach: count promo codes for each promotion individually
    const promoCodeCounts = await Promise.all(
      promotionIds.map(async (promotionId) => {
        const count = await this.promoCodeModel.countDocuments({
          promotionId: new Types.ObjectId(promotionId),
        });
        console.log(`Promotion ${promotionId}: ${count} promo codes`);
        return { promotionId, count };
      }),
    );

    // Create a map of promotion ID to count
    const countMap = new Map();
    promoCodeCounts.forEach((item) => {
      countMap.set(item.promotionId, item.count);
    });

    // Add promo code count to each promotion
    const dataWithCounts = plainData.map((promotion) => ({
      ...promotion,
      promoCodeCount: countMap.get(promotion.id) || 0,
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
        filters: request.filters,
      },
    };
  }

  async findOne(id: string, user: any): Promise<PromotionResponseDto> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_NOT_FOUND);
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    return this.transformPromotionToResponse(promotion);
  }

  async update(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
    user: any,
  ): Promise<PromotionResponseDto> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_NOT_FOUND);
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Additional validation for certain fields
    if (
      updatePromotionDto.price !== undefined &&
      updatePromotionDto.price <= 0
    ) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_PRICE_INVALID);
    }

    if (
      updatePromotionDto.points !== undefined &&
      updatePromotionDto.points <= 0
    ) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_POINTS_INVALID);
    }

    // Handle status change if included
    if (updatePromotionDto.status !== undefined) {
      // Validate status transition
      this.validateStatusTransition(
        promotion.status,
        updatePromotionDto.status,
      );

      // If status is being changed to 'deleted', soft delete all associated promo codes
      if (updatePromotionDto.status === "deleted") {
        const updatedPromoCodes = await this.promoCodeModel
          .updateMany({ promotionId: promotion._id }, { status: "deleted" })
          .exec();
        console.log(
          `Soft deleted ${updatedPromoCodes.modifiedCount} promo codes for promotion ${id} due to status change to deleted`,
        );
      }
    }

    const updatedPromotion = await this.promotionModel
      .findByIdAndUpdate(id, updatePromotionDto, { new: true })
      .exec();

    if (!updatedPromotion) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_NOT_FOUND);
    }

    return this.transformPromotionToResponse(updatedPromotion);
  }

  async changeStatus(
    id: string,
    changeStatusDto: ChangePromotionStatusDto,
    user: any,
  ): Promise<PromotionResponseDto> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_NOT_FOUND);
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Validate status transition
    this.validateStatusTransition(promotion.status, changeStatusDto.status);

    // If status is being changed to 'deleted', soft delete all associated promo codes
    if (changeStatusDto.status === "deleted") {
      const updatedPromoCodes = await this.promoCodeModel
        .updateMany({ promotionId: promotion._id }, { status: "deleted" })
        .exec();
      console.log(
        `Soft deleted ${updatedPromoCodes.modifiedCount} promo codes for promotion ${id} due to status change to deleted`,
      );
    }

    const updatedPromotion = await this.promotionModel
      .findByIdAndUpdate(id, { status: changeStatusDto.status }, { new: true })
      .exec();

    if (!updatedPromotion) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_NOT_FOUND);
    }

    return this.transformPromotionToResponse(updatedPromotion);
  }

  async remove(id: string, user: any): Promise<void> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_NOT_FOUND);
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Soft delete all associated promo codes first
    const updatedPromoCodes = await this.promoCodeModel
      .updateMany({ promotionId: promotion._id }, { status: "deleted" })
      .exec();
    console.log(
      `Soft deleted ${updatedPromoCodes.modifiedCount} promo codes for promotion ${id}`,
    );

    // Soft delete the promotion by changing status to 'deleted'
    await this.promotionModel
      .findByIdAndUpdate(id, { status: "deleted" })
      .exec();
  }

  private async validateStoreAccess(storeId: string, user: any): Promise<void> {
    // Admin can access everything
    if (user.role === "admin") {
      return;
    }

    // Store users can only access their own store's promotions
    if (user.role === "store") {
      const store = await this.storeModel.findById(storeId).exec();
      if (!store || store.userId.toString() !== user._id.toString()) {
        throw new ForbiddenException(
          "You do not have permission to access this store's promotions",
        );
      }
      return;
    }

    throw new ForbiddenException(PERSIAN_ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus: string,
  ): void {
    const validTransitions: { [key: string]: string[] } = {
      active: ["inactive", "deleted", "expired"],
      inactive: ["active", "deleted"],
      expired: ["deleted"],
      deleted: [], // Cannot transition from deleted
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change status from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  // Helper method to get promotion statistics
  async getPromotionStats(
    storeId?: string,
    user?: any,
  ): Promise<{
    total: number;
    active: number;
    inactive: number;
    expired: number;
    deleted: number;
  }> {
    let filter: any = {};

    // Add role-based access control
    if (user?.role === "store") {
      // Store users can only see stats for their own store
      if (user.storeId) {
        filter.storeId = new Types.ObjectId(user.storeId);
      } else {
        // If user has no store, return zero stats
        return { total: 0, active: 0, inactive: 0, expired: 0, deleted: 0 };
      }
    } else if (user?.role === "admin" && storeId) {
      // Admin users can specify a storeId to filter by
      filter.storeId = new Types.ObjectId(storeId);
    } else if (user?.role === "admin") {
      // Admin users without storeId see all promotions
      filter = {};
    } else {
      // For other roles or no user, return zero stats
      return { total: 0, active: 0, inactive: 0, expired: 0, deleted: 0 };
    }

    const [total, active, inactive, expired, deleted] = await Promise.all([
      this.promotionModel.countDocuments(filter),
      this.promotionModel.countDocuments({ ...filter, status: "active" }),
      this.promotionModel.countDocuments({ ...filter, status: "inactive" }),
      this.promotionModel.countDocuments({ ...filter, status: "expired" }),
      this.promotionModel.countDocuments({ ...filter, status: "deleted" }),
    ]);

    return { total, active, inactive, expired, deleted };
  }

  // Helper method to get promotion with promo code count and list
  async getPromotionWithCodeCount(
    id: string,
    user: any,
  ): Promise<PromotionResponseDto & { promoCodeCount: number; promoCodes: any[] }> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new BadRequestException(PERSIAN_ERROR_MESSAGES.PROMOTION_NOT_FOUND);
    }

    // Validate access permissions
    await this.validateStoreAccess(promotion.storeId.toString(), user);

    // Get promo codes for this promotion
    const promoCodes = await this.promoCodeModel
      .find({ promotionId: promotion._id, status: { $ne: "deleted" } })
      .populate("promotionId", "title price points status")
      .populate("userId", "phoneNumber firstName lastName")
      .sort({ createdAt: -1 })
      .exec();

    const promoCodeCount = promoCodes.length;

    return {
      ...this.transformPromotionToResponse(promotion),
      promoCodeCount,
      promoCodes: promoCodes.map((promoCode) => ({
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
        promotion: promoCode.promotionId,
        user: promoCode.userId,
      })),
    };
  }
}
