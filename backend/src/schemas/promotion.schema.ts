import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { globalTransformPlugin } from './global-transform.plugin';

/**
 * Interface representing a Promotion document in MongoDB
 */
export interface PromotionDocument extends Document {
  _id: Types.ObjectId;
  storeId: Types.ObjectId;       // Reference to the Store this promotion belongs to
  title: string;                 // Short title for display
  description?: string;          // Optional detailed description
  price: number;                 // Purchase amount in Toman (e.g., 100000)
  points: number;                // Points awarded for the purchase (e.g., 1)
  status: string;                // Status of the promotion: active, inactive, deleted, or expired
  createdAt: Date;               // Automatically added by timestamps: true
  updatedAt: Date;               // Automatically added by timestamps: true
}

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Promotion {
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Store', 
    required: true 
  })
  storeId: Types.ObjectId;
  // Reference to the store this promotion belongs to

  @Prop({ 
    required: true, 
    trim: true, 
    maxlength: 100 
  })
  title: string;
  // Short title for display in UI

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 500 
  })
  description?: string;
  // Optional longer description or terms and conditions

  @Prop({ required: true, min: 0 })
  price: number;
  // Purchase amount in Toman (e.g., 100000 Toman)

  @Prop({ required: true, min: 1 })
  points: number;
  // Number of points awarded for the purchase (e.g., 1 point)

  @Prop({ 
    enum: ['active', 'inactive', 'deleted', 'expired'], 
    default: 'active' 
  })
  status: string;
  // Status of the promotion: active, inactive, deleted, or expired
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);

// Apply global transform plugin
PromotionSchema.plugin(globalTransformPlugin);

// Indexes for better query performance
PromotionSchema.index({ storeId: 1, status: 1 });
PromotionSchema.index({ status: 1 });
PromotionSchema.index({ storeId: 1, status: 1, price: 1 }); // For finding promotions by store and price
