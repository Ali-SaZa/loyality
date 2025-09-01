import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Interface representing a Promotion document in MongoDB
 */
export interface PromotionDocument extends Document {
  _id: Types.ObjectId;
  storeId: Types.ObjectId;       // Reference to the Store this promotion belongs to
  type: string;                  // Type of promotion (coupon, cashback, referral, etc.)
  title: string;                 // Short title for display
  description?: string;          // Optional detailed description
  value?: number;                // Discount value (percentage or fixed amount in Toman)
  minPurchaseAmount?: number;    // Minimum purchase amount to apply promotion
  maxDiscountAmount?: number;    // Maximum discount amount
  code?: string;                 // Promo code (for coupon type)
  points?: number;               // Loyalty points to be awarded (for loyaltyPoints type)
  startDate?: Date;              // Start date of promotion validity
  endDate?: Date;                // End date of promotion validity
  status: string;                // Status of the promotion: active, inactive, deleted, or expired
  usageLimit?: number;           // Maximum usage limit per customer or overall
  applicableEvents?: string[];   // Applicable events for behavioral/event-based promotions
  currentUsageCount?: number;    // Current number of times this promotion has been used
  maxUsagePerCustomer?: number;  // Maximum usage limit per individual customer
  usedBy?: Types.ObjectId[];     // Track which users have used this promotion
  isStackable?: boolean;         // Whether this promotion can be combined with others
  stackableWith?: string[];      // Array of promotion types this can be stacked with
  termsAndConditions?: string;   // Terms and conditions for this promotion
  requiresApproval?: boolean;    // Whether this promotion requires manual approval
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
    enum: [
      'coupon',         // Standard promo code
      'cashback',       // Cashback applied after purchase
      'referral',       // Discount for referral or friend invite
      'conditional',    // Tiered/conditional discount based on purchase amount
      'percentage',     // Percentage discount
      'fixed',          // Fixed amount discount in Toman
      'flashSale',      // Limited-time flash sale
      'freeShipping',   // Free shipping incentive
      'loyaltyPoints',  // Reward points for loyalty program
      'behavioral',     // Event-based or behavior-triggered discount
      'stackable',      // Stackable/multi-step discounts
    ],
    required: true,
  })
  type: string;
  // Type of promotion, determines which fields are relevant

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

  @Prop({ required: false, min: 0 })
  value?: number;
  // Discount value (percentage or fixed amount in Toman)

  @Prop({ required: false, min: 0 })
  minPurchaseAmount?: number;
  // Minimum purchase amount required to apply this promotion (for conditional/tiered discounts)

  @Prop({ required: false, min: 0 })
  maxDiscountAmount?: number;
  // Maximum discount amount allowed (optional)

  @Prop({ required: false, trim: true })
  code?: string;
  // Promo code string (used for coupon type promotions)

  @Prop({ required: false, min: 0 })
  points?: number;
  // Number of loyalty points awarded (used for loyaltyPoints type)

  @Prop({ required: false })
  startDate?: Date;
  // Date when the promotion becomes active

  @Prop({ required: false })
  endDate?: Date;
  // Date when the promotion expires

  @Prop({ 
    enum: ['active', 'inactive', 'deleted', 'expired'], 
    default: 'active' 
  })
  status: string;
  // Status of the promotion: active, inactive, deleted, or expired

  @Prop({ required: false, min: 1 })
  usageLimit?: number;
  // Maximum usage limit per customer or in total (optional)

  @Prop({ type: [String], required: false })
  applicableEvents?: string[];
  // Applicable events or triggers for behavioral/event-based promotions

  @Prop({ required: false, min: 0 })
  currentUsageCount?: number;
  // Current number of times this promotion has been used

  @Prop({ required: false, min: 0 })
  maxUsagePerCustomer?: number;
  // Maximum usage limit per individual customer

  @Prop({ type: [Types.ObjectId], ref: 'User', required: false })
  usedBy?: Types.ObjectId[];
  // Track which users have used this promotion (for per-customer limits)

  @Prop({ required: false, default: false })
  isStackable?: boolean;
  // Whether this promotion can be combined with other promotions

  @Prop({ type: [String], required: false })
  stackableWith?: string[];
  // Array of promotion types this can be stacked with

  @Prop({ required: false, trim: true })
  termsAndConditions?: string;
  // Terms and conditions for this promotion

  @Prop({ required: false, default: false })
  requiresApproval?: boolean;
  // Whether this promotion requires manual approval before activation
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);

// Indexes for better query performance
PromotionSchema.index({ storeId: 1, status: 1 });
PromotionSchema.index({ type: 1, status: 1 });
PromotionSchema.index({ code: 1 }, { unique: true, sparse: true }); // Unique promo codes
PromotionSchema.index({ startDate: 1, endDate: 1 }); // Date range queries
PromotionSchema.index({ storeId: 1, type: 1, status: 1 }); // Compound index for store-specific type queries
PromotionSchema.index({ status: 1, endDate: 1 }); // For finding expired promotions
