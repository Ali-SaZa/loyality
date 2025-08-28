import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto } from '../dto';
import { ListRequestDto, ListResponseDto } from '../common/dto/list.dto';
import { GenericListService } from '../common/services/generic-list.service';
import { 
  StoreNotFoundException, 
  StorePhoneExistsException,
  CustomConflictException 
} from '../common/errors';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class StoresService extends GenericListService<StoreDocument> {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {
    super(storeModel);
  }

  private transformStoreToResponse(store: StoreDocument): StoreResponseDto {
    return {
      id: store._id.toString(),
      name: store.name,
      ownerName: store.ownerName,
      phoneNumber: store.phoneNumber,
      address: store.address,
      loyaltySettings: store.loyaltySettings,
      plan: store.plan,
      role: store.role,
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

    const store = new this.storeModel(createStoreDto);
    const savedStore = await store.save();
    return this.transformStoreToResponse(savedStore);
  }

  // Override the findAll method to add role-based filtering
  async findAll(request: ListRequestDto, additionalFilters: any = {}): Promise<ListResponseDto<StoreDocument>> {
    // Add role-based access control
    if (additionalFilters.requestingUser?.role === 'store') {
      // Store users can only see their own store
      additionalFilters['_id'] = additionalFilters.requestingUser.storeId;
    }

    return super.findAll(request, additionalFilters);
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
    if (user.role === 'store' && user.storeId === store._id.toString()) {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز تغییر این فروشگاه را ندارید.'); // translated to Persian
  }

  // Get available filter options for the frontend
  async getFilterOptions(): Promise<{
    plans: string[];
    roles: string[];
  }> {
    const [plans, roles] = await Promise.all([
      this.getDistinctValues('plan'),
      this.getDistinctValues('role')
    ]);

    return {
      plans: plans.filter(Boolean),
      roles: roles.filter(Boolean)
    };
  }
}
