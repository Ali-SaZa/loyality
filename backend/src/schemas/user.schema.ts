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
  firstName?: string;

  @Prop({ required: false, trim: true, maxlength: 100 })
  lastName?: string;

  @Prop({ default: 0, min: 0 })
  totalPoints: number;

  @Prop({ type: [Purchase], default: [] })
  purchases: Purchase[];

  @Prop({ enum: ['customer', 'store', 'admin'], default: 'customer', required: true })
  role: string;

  @Prop({ 
    enum: ['active', 'blocked', 'deleted'], 
    default: 'active', 
    required: true,
    index: true 
  })
  status: string;

  @Prop({ required: true, default: Date.now })
  lastActivity: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
