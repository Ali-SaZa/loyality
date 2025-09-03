import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { globalTransformPlugin } from './global-transform.plugin';

export interface TransactionDocument extends Transaction, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  customerId: Types.ObjectId;
  // Reference to the customer who made the transaction

  @Prop({ type: Types.ObjectId, ref: 'Store', required: true, index: true })
  storeId: Types.ObjectId;
  // Reference to the store where the transaction occurred

  @Prop({ type: Types.ObjectId, ref: 'PromoCode', required: true, index: true })
  promoCodeId: Types.ObjectId;
  // Reference to the promo code used

  @Prop({ type: Types.ObjectId, ref: 'Promotion', required: true, index: true })
  promotionId: Types.ObjectId;
  // Reference to the promotion (can be obtained through promo code, but stored for performance)
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Apply global transform plugin
TransactionSchema.plugin(globalTransformPlugin);

// Create compound indexes for better query performance
TransactionSchema.index({ customerId: 1, storeId: 1 });
TransactionSchema.index({ storeId: 1, createdAt: -1 });
TransactionSchema.index({ customerId: 1, createdAt: -1 });
TransactionSchema.index({ promoCodeId: 1 });
TransactionSchema.index({ promotionId: 1 });
