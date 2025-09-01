import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Interface representing a PromoCode document in MongoDB
 */
export interface PromoCodeDocument extends Document {
  _id: Types.ObjectId;
  code: string;                    // The unique code string
  promotionId: Types.ObjectId;      // Reference to the associated Promotion
  status: 'unused' | 'used' | 'expired'; // Current status of the code
  userId?: Types.ObjectId;          // Reference to the user who used the code (optional)
  usedAt?: Date;                     // Timestamp when the code was used
  expiresAt?: Date;                  // When this specific code expires
  notes?: string;                    // Optional notes about this specific code
  createdAt: Date;                   // Automatically added by timestamps: true
  updatedAt: Date;                   // Automatically added by timestamps: true
}

@Schema({ timestamps: true })
export class PromoCode {
  @Prop({
    required: true,
    unique: true,
    match: /^[A-Z0-9]{6,12}$/, // Alphanumeric code, 6-12 characters
    index: true,
  })
  code: string;
  // Unique code string for this promo

  @Prop({ type: Types.ObjectId, ref: 'Promotion', required: true, index: true })
  promotionId: Types.ObjectId;
  // Reference to the promotion this code belongs to

  @Prop({
    enum: ['unused', 'used', 'expired'],
    default: 'unused',
    required: true,
  })
  status: 'unused' | 'used' | 'expired';
  // Current status of the promo code

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;
  // The user who redeemed/used the code (optional)

  @Prop({ required: false })
  usedAt?: Date;
  // Timestamp when the code was used

  @Prop({ required: false })
  expiresAt?: Date;
  // When this specific code expires (can be different from promotion end date)

  @Prop({ required: false, trim: true })
  notes?: string;
  // Optional notes about this specific code (e.g., "VIP customer code")
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);

// Indexes for fast lookup
PromoCodeSchema.index({ code: 1 }, { unique: true }); // Unique code search
PromoCodeSchema.index({ promotionId: 1 });            // Codes by promotion
PromoCodeSchema.index({ status: 1 });                 // Active/Used/Expired filtering
PromoCodeSchema.index({ userId: 1 });                 // Codes used by specific users
PromoCodeSchema.index({ promotionId: 1, status: 1 }); // Compound: promotion + status
PromoCodeSchema.index({ expiresAt: 1 });              // Expiration queries
PromoCodeSchema.index({ usedAt: 1 });                 // Usage analytics
