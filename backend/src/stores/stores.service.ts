import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto, CreateStoreWithUserDto, StoreWithUserResponseDto } from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { 
  StoreNotFoundException, 
  StorePhoneExistsException
} from '../common/errors';

interface UserContext {
  _id: string;
  role: string;
  storeId?: string;
}

export interface StoreStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Transform store document to response DTO
   */
  private transformStoreToResponse(store: StoreDocument): StoreResponseDto {
    return {
      id: store._id.toString(),
      name: store.name,
      phoneNumber: store.phoneNumber,
      userId: store.userId.toString(),
      address: store.address,
      promotions: store.promotions.map(promo => promo.toString()),
      planExpiryDate: store.planExpiryDate,
      status: store.status,
      logoUrl: store.logoUrl,
      description: store.description,
      socialLinks: store.socialLinks,
      workingHours: store.workingHours,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    };
  }

  /**
   * Consolidated validation for store creation
   */
  private async validateStoreCreation(phoneNumber: string, userId?: string): Promise<void> {
    const [existingStore, user] = await Promise.all([
      this.storeModel.findOne({ phoneNumber }).exec(),
      userId ? this.userModel.findById(userId).exec() : Promise.resolve(null)
    ]);
    
    if (existingStore) {
      throw new StorePhoneExistsException();
    }
    
    if (userId && !user) {
      throw new BadRequestException('User not found');
    }
  }

  /**
   * Validate user creation for store with user
   */
  private async validateUserCreation(phoneNumber: string): Promise<void> {
    const existingUser = await this.userModel.findOne({ phoneNumber }).exec();
    if (existingUser) {
      throw new BadRequestException('User with this phone number already exists');
    }
  }

  /**
   * Sanitize search input to prevent regex injection
   */
  private sanitizeSearchQuery(search: string): string {
    return search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Standardized error handling
   */
  private handleStoreNotFound(): never {
    throw new StoreNotFoundException();
  }

  private handleAccessDenied(): never {
    throw new ForbiddenException('Access denied. You do not have permission to access this store.');
  }

  /**
   * Create a new store
   */
  async create(createStoreDto: CreateStoreDto): Promise<StoreResponseDto> {
    await this.validateStoreCreation(createStoreDto.phoneNumber, createStoreDto.userId);

    const store = new this.storeModel(createStoreDto);
    const savedStore = await store.save();
    return this.transformStoreToResponse(savedStore);
  }

  /**
   * Create a new store with user
   */
  async createStoreWithUser(createStoreWithUserDto: CreateStoreWithUserDto): Promise<StoreWithUserResponseDto> {
    // Validate both user and store creation
    await Promise.all([
      this.validateUserCreation(createStoreWithUserDto.user.phoneNumber),
      this.validateStoreCreation(createStoreWithUserDto.store.phoneNumber)
    ]);

    // Create the user first
    const userData = {
      ...createStoreWithUserDto.user,
      role: 'store',
      totalPoints: 0,
      purchases: [],
      status: 'active',
      lastActivity: new Date()
    };

    const user = new this.userModel(userData);
    const savedUser = await user.save();

    // Create the store with the user's ID
    const storeData = {
      ...createStoreWithUserDto.store,
      userId: savedUser._id,
      status: 'active'
    };

    const store = new this.storeModel(storeData);
    const savedStore = await store.save();

    return {
      user: {
        id: savedUser._id.toString(),
        phoneNumber: savedUser.phoneNumber,
        firstName: savedUser.firstName || '',
        lastName: savedUser.lastName || '',
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt
      },
      store: this.transformStoreToResponse(savedStore)
    };
  }

  /**
   * Find all stores with pagination and filtering (optimized)
   */
  async findAll(request: ListRequestDto, additionalFilters: Record<string, any> = {}): Promise<ListResponseDto<StoreDocument>> {
    const page = request.page || 1;
    const limit = Math.min(request.limit || 20, 100); // Cap at 100 for performance
    const skip = (page - 1) * limit;

    // Add role-based access control
    if (additionalFilters.requestingUser?.role === 'store') {
      additionalFilters['userId'] = additionalFilters.requestingUser._id;
    }

    // Build filter query with sanitized search
    let filterQuery: Record<string, any> = {};
    
    if (request.search && request.searchFields && request.searchFields.length > 0) {
      const sanitizedSearch = this.sanitizeSearchQuery(request.search);
      const searchQueries = request.searchFields.map(field => ({
        [field]: { $regex: sanitizedSearch, $options: 'i' }
      }));
      filterQuery.$or = searchQueries;
    }

    // Add additional filters
    Object.assign(filterQuery, additionalFilters);

    // Execute queries in parallel with optimized population
    const [data, total] = await Promise.all([
      this.storeModel
        .find(filterQuery)
        .populate('userId', 'firstName lastName phoneNumber role')
        .populate('promotions', 'title type status')
        .sort(this.buildSortQuery(request.sort || []))
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.storeModel.countDocuments(filterQuery).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      appliedFilters: {
        search: request.search,
        searchFields: request.searchFields,
        sort: request.sort,
        filters: request.filters
      }
    };
  }

  /**
   * Find a store by ID with access control
   */
  async findOne(id: string, user: UserContext): Promise<StoreResponseDto> {
    const store = await this.storeModel
      .findById(id)
      .populate('userId', 'firstName lastName phoneNumber role')
      .populate('promotions', 'title type status')
      .exec();
    
    if (!store) {
      this.handleStoreNotFound();
    }

    this.validateStoreAccess(store, user);
    return this.transformStoreToResponse(store);
  }

  /**
   * Update a store with access control
   */
  async update(id: string, updateStoreDto: UpdateStoreDto, user: UserContext): Promise<StoreResponseDto> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      this.handleStoreNotFound();
    }

    this.validateStoreAccess(store, user);

    const updatedStore = await this.storeModel
      .findByIdAndUpdate(id, updateStoreDto, { new: true })
      .populate('userId', 'firstName lastName phoneNumber role')
      .populate('promotions', 'title type status')
      .exec();
    
    if (!updatedStore) {
      this.handleStoreNotFound();
    }
    
    return this.transformStoreToResponse(updatedStore);
  }

  /**
   * Remove a store with access control
   */
  async remove(id: string, user: UserContext): Promise<void> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      this.handleStoreNotFound();
    }

    this.validateStoreAccess(store, user);

    const result = await this.storeModel.findByIdAndDelete(id).exec();
    if (!result) {
      this.handleStoreNotFound();
    }
  }

  /**
   * Find store by phone number
   */
  async findByPhoneNumber(phoneNumber: string): Promise<StoreResponseDto | null> {
    const store = await this.storeModel
      .findOne({ phoneNumber })
      .populate('userId', 'firstName lastName phoneNumber role')
      .exec();
    
    return store ? this.transformStoreToResponse(store) : null;
  }

  /**
   * Get store statistics (optimized)
   */
  async getStats(): Promise<StoreStats> {
    const [total, active, pending, inactive] = await Promise.all([
      this.storeModel.countDocuments().exec(),
      this.storeModel.countDocuments({ status: 'active' }).exec(),
      this.storeModel.countDocuments({ status: 'pending' }).exec(),
      this.storeModel.countDocuments({ status: 'suspended' }).exec()
    ]);

    return { total, active, pending, inactive };
  }

  /**
   * Validate store access permissions
   */
  private validateStoreAccess(store: StoreDocument, user: UserContext): void {
    if (user.role === 'admin') {
      return;
    }

    if (user.role === 'store' && user._id === store.userId.toString()) {
      return;
    }

    this.handleAccessDenied();
  }

  /**
   * Build sort query from request
   */
  private buildSortQuery(sort: any[]): Record<string, 1 | -1> {
    if (!sort || sort.length === 0) {
      return { createdAt: -1 };
    }

    const sortQuery: Record<string, 1 | -1> = {};
    sort.forEach((item: any) => {
      sortQuery[item.field] = item.direction === 'asc' ? 1 : -1;
    });
    return sortQuery;
  }
}
