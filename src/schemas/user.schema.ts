import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ _id: false })
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: 'Store', required: true, index: true })
  storeId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ required: false })
  scratchCode?: string;

  @Prop({ enum: ['sms', 'qr'], required: true })
  entryMethod: 'sms' | 'qr';

  @Prop({
    type: { type: String, enum: ['discount', 'cashback', 'lottery'], required: true },
    value: { type: Number, required: true, min: 0 }
  })
  rewardApplied: {
    type: 'discount' | 'cashback' | 'lottery';
    value: number;
  };
}

@Schema({ _id: false })
export class Consents {
  @Prop({ required: true, default: false })
  dataCollection: boolean;

  @Prop({ required: true, default: false })
  marketing: boolean;

  @Prop({ required: false })
  consentDate?: Date;
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    match: /^09[0-9]{9}$/,
    index: true,
  })
  phoneNumber: string;

  @Prop({ required: false, trim: true, maxlength: 100 })
  name?: string;

  @Prop({ default: 0, min: 0 })
  totalPoints: number;

  @Prop({ type: [Purchase], default: [] })
  purchases: Purchase[];

  @Prop({ type: Consents, required: true })
  consents: Consents;

  @Prop({ enum: ['customer'], default: 'customer', required: true })
  role: string;

  @Prop({ required: false })
  lastActivity?: Date;

  @Prop([{ type: String, trim: true }])
  tags: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
