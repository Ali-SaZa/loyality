import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../schemas/store.schema';

@Injectable()
export class AddSmsFieldsToStoresMigration {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

  async up(): Promise<void> {
    console.log('🔄 Adding SMS fields to existing stores...');
    
    // Update all stores that don't have SMS fields
    const result = await this.storeModel.updateMany(
      {
        $or: [
          { smsBalance: { $exists: false } },
          { lastSmsSentAt: { $exists: false } },
          { totalSmsSent: { $exists: false } }
        ]
      },
      {
        $set: {
          smsBalance: 0,
          lastSmsSentAt: null,
          totalSmsSent: 0
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} stores with SMS fields`);
  }

  async down(): Promise<void> {
    console.log('🔄 Removing SMS fields from stores...');
    
    // Remove SMS fields from all stores
    const result = await this.storeModel.updateMany(
      {},
      {
        $unset: {
          smsBalance: 1,
          lastSmsSentAt: 1,
          totalSmsSent: 1
        }
      }
    );

    console.log(`✅ Removed SMS fields from ${result.modifiedCount} stores`);
  }
}
