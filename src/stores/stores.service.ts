import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto } from '../dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

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
      throw new ConflictException('Store with this phone number already exists');
    }

    const store = new this.storeModel(createStoreDto);
    const savedStore = await store.save();
    return this.transformStoreToResponse(savedStore);
  }

  async findAll(): Promise<StoreResponseDto[]> {
    const stores = await this.storeModel.find().exec();
    return stores.map(store => this.transformStoreToResponse(store));
  }

  async findOne(id: string): Promise<StoreResponseDto> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return this.transformStoreToResponse(store);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<StoreResponseDto> {
    const store = await this.storeModel
      .findByIdAndUpdate(id, updateStoreDto, { new: true })
      .exec();
    
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    return this.transformStoreToResponse(store);
  }

  async remove(id: string): Promise<void> {
    const result = await this.storeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Store not found');
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<StoreResponseDto | null> {
    const store = await this.storeModel.findOne({ phoneNumber }).exec();
    return store ? this.transformStoreToResponse(store) : null;
  }
}
