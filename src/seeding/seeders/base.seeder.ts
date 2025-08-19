import { Logger } from '@nestjs/common';
import { Model, Document } from 'mongoose';

export abstract class BaseSeeder<T extends Document> {
  protected readonly logger = new Logger(this.constructor.name);
  protected abstract model: Model<T>;
  protected abstract data: any[];

  async seed(): Promise<T[]> {
    this.logger.log(`Starting to seed ${this.constructor.name}...`);
    
    try {
      const documents = await this.model.insertMany(this.data);
      this.logger.log(`✅ Created ${documents.length} ${this.constructor.name} documents`);
      return documents;
    } catch (error) {
      this.logger.error(`❌ Failed to seed ${this.constructor.name}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.log(`Clearing ${this.constructor.name} collection...`);
    
    try {
      await this.model.deleteMany({});
      this.logger.log(`✅ Cleared ${this.constructor.name} collection`);
    } catch (error) {
      this.logger.error(`❌ Failed to clear ${this.constructor.name} collection:`, error);
      throw error;
    }
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }

  protected abstract getData(): any[];
}
