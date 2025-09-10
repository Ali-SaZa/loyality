import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { globalTransformPlugin } from "./global-transform.plugin";

export interface StoreDocument extends Store, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ _id: false })
export class StoreAddress {
  @Prop({ required: true, trim: true, maxlength: 100 })
  province: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  city: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  fullAddress: string;
}

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^09[0-9]{9}$/,
    index: true,
  })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: StoreAddress, required: true })
  address: StoreAddress;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Promotion" }], default: [] })
  promotions: Types.ObjectId[];

  @Prop({ required: false })
  planExpiryDate?: Date;

  @Prop({
    enum: ["active", "pending", "deleted", "suspended"],
    default: "active",
  })
  status: string;

  @Prop({ required: false, trim: true })
  logoUrl?: string;

  @Prop({ required: false, trim: true, maxlength: 500 })
  description?: string;

  @Prop({
    type: {
      website: { type: String, trim: true },
      instagram: { type: String, trim: true },
      telegram: { type: String, trim: true },
    },
    required: false,
    _id: false,
  })
  socialLinks?: {
    website?: string;
    instagram?: string;
    telegram?: string;
  };

  @Prop({
    type: {
      open: { type: String }, //  "09:00"
      close: { type: String }, //  "21:00"
    },
    required: false,
    _id: false,
  })
  workingHours?: {
    open: string;
    close: string;
  };

  @Prop({ default: 0, min: 0 })
  smsBalance: number;

  @Prop()
  lastSmsSentAt?: Date;

  @Prop({ default: 0, min: 0 })
  totalSmsSent: number;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

// Apply global transform plugin
StoreSchema.plugin(globalTransformPlugin);
