import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto, CreateStoreWithUserDto, StoreWithUserResponseDto } from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { 
  StoreNotFoundException, 
  StorePhoneExistsException,
  CustomConflictException 
} from '../common/errors';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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

  async create(createStoreDto: CreateStoreDto): Promise<StoreResponseDto> {
    // Check if store with same phone number already exists
    const existingStore = await this.storeModel.findOne({
      phoneNumber: createStoreDto.phoneNumber,
    });
    
    if (existingStore) {
      throw new StorePhoneExistsException();
    }

    // Validate that the userId exists in the users collection
    const user = await this.userModel.findById(createStoreDto.userId).exec();
    if (!user) {
      throw new BadRequestException('کاربر مورد نظر پیدا نشد.'); // translated to Persian
    }

    const store = new this.storeModel(createStoreDto);
    const savedStore = await store.save();
    return this.transformStoreToResponse(savedStore);
  }

  async createStoreWithUser(createStoreWithUserDto: CreateStoreWithUserDto): Promise<StoreWithUserResponseDto> {
    // Check if user with same phone number already exists
    const existingUser = await this.userModel.findOne({
      phoneNumber: createStoreWithUserDto.user.phoneNumber,
    });
    
    if (existingUser) {
      throw new BadRequestException('کاربری با این شماره تلفن قبلاً وجود دارد.'); // User with this phone number already exists
    }

    // Check if store with same phone number already exists
    const existingStore = await this.storeModel.findOne({
      phoneNumber: createStoreWithUserDto.store.phoneNumber,
    });
    
    if (existingStore) {
      throw new StorePhoneExistsException();
    }

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
      status: 'active' // Set default status
    };

    const store = new this.storeModel(storeData);
    const savedStore = await store.save();

    // Return both user and store
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

  // Implement findAll method without generic service
  async findAll(request: ListRequestDto, additionalFilters: any = {}): Promise<ListResponseDto<StoreDocument>> {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const skip = (page - 1) * limit;

    // Add role-based access control
    if (additionalFilters.requestingUser?.role === 'store') {
      // Store users can only see their own store
      additionalFilters['userId'] = additionalFilters.requestingUser._id;
    }

    // Build filter query
    let filterQuery: any = {};
    
    // Add search functionality
    if (request.search && request.searchFields && request.searchFields.length > 0) {
      const searchQueries = request.searchFields.map(field => ({
        [field]: { $regex: request.search, $options: 'i' }
      }));
      filterQuery.$or = searchQueries;
    }

    // Add additional filters
    Object.assign(filterQuery, additionalFilters);

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.storeModel
        .find(filterQuery)
        .sort(this.buildSortQuery(request.sort))
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.storeModel.countDocuments(filterQuery).exec()
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

  async findOne(id: string, user: any): Promise<StoreResponseDto> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new StoreNotFoundException();
    }

    // Validate access permissions
    await this.validateStoreAccess(store, user);

    return this.transformStoreToResponse(store);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto, user: any): Promise<StoreResponseDto> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new StoreNotFoundException();
    }

    // Validate access permissions
    await this.validateStoreAccess(store, user);

    const updatedStore = await this.storeModel
      .findByIdAndUpdate(id, updateStoreDto, { new: true })
      .exec();
    
    if (!updatedStore) {
      throw new StoreNotFoundException();
    }
    
    return this.transformStoreToResponse(updatedStore);
  }

  async remove(id: string, user: any): Promise<void> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new StoreNotFoundException();
    }

    // Validate access permissions
    await this.validateStoreAccess(store, user);

    const result = await this.storeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new StoreNotFoundException();
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<StoreResponseDto | null> {
    const store = await this.storeModel.findOne({ phoneNumber }).exec();
    return store ? this.transformStoreToResponse(store) : null;
  }

  private async validateStoreAccess(store: StoreDocument, user: any): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store users can only modify their own store
    if (user.role === 'store' && user._id.toString() === store.userId.toString()) {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز تغییر این فروشگاه را ندارید.'); // translated to Persian
  }

  // Get available filter options for the frontend
  async getFilterOptions(): Promise<{
    statuses: string[];
  }> {
    const statuses = await this.getDistinctValues('status');

    return {
      statuses: statuses.filter(Boolean)
    };
  }

  // Count stores with optional filter
  async count(filter: any = {}): Promise<number> {
    return this.storeModel.countDocuments(filter).exec();
  }

  // Helper method to get distinct values
  private async getDistinctValues(field: string): Promise<any[]> {
    return this.storeModel.distinct(field).exec();
  }

  private buildSortQuery(sort: any): any {
    if (!sort || sort.length === 0) {
      return { createdAt: -1 };
    }

    const sortQuery: any = {};
    sort.forEach((item: any) => {
      sortQuery[item.field] = item.direction === 'asc' ? 1 : -1;
    });
    return sortQuery;
  }
}
