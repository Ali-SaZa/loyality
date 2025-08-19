import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface StoreDocument extends Store, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ _id: false })
export class LoyaltyTier {
  @Prop({ required: true, min: 0 })
  minAmount: number;

  @Prop({ enum: ['discount', 'cashback', 'lottery'], required: true })
  rewardType: 'discount' | 'cashback' | 'lottery';

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ required: false })
  description?: string;
}

@Schema({ _id: false })
export class LoyaltySettings {
  @Prop({ type: [LoyaltyTier], default: [] })
  tiers: LoyaltyTier[];

  @Prop({ enum: ['weekly', 'monthly', 'none'], default: 'none' })
  lotteryFrequency: 'weekly' | 'monthly' | 'none';

  @Prop({ default: 0, min: 0 })
  defaultCashbackRate: number;
}

@Schema({ _id: false })
export class StoreAddress {
  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: false, trim: true })
  street?: string;

  @Prop({
    type: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false }
    },
    required: false
  })
  coordinates?: {
    lat: number;
    lng: number;
  };
}

@Schema({ _id: false })
export class StorePlan {
  @Prop({ enum: ['free', 'premium'], default: 'free' })
  type: 'free' | 'premium';

  @Prop({ required: true, default: Date.now })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  ownerName: string;

  @Prop({
    required: true,
    unique: true,
    match: /^09[0-9]{9}$/,
    index: true,
  })
  phoneNumber: string;

  @Prop({ type: StoreAddress, required: true })
  address: StoreAddress;

  @Prop({ type: LoyaltySettings, required: true })
  loyaltySettings: LoyaltySettings;

  @Prop({ type: StorePlan, required: true })
  plan: StorePlan;

  @Prop({ enum: ['store'], default: 'store', required: true })
  role: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);