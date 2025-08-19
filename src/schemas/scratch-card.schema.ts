import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScratchCardDocument = ScratchCard & Document;

@Schema({ _id: false })
export class ScratchCardReward {
  @Prop({ enum: ['discount', 'cashback', 'lottery'], required: true })
  type: 'discount' | 'cashback' | 'lottery';

  @Prop({ required: true, min: 0 })
  value: number;
}

@Schema({ timestamps: true })
export class ScratchCard {
  @Prop({
    required: true,
    unique: true,
    match: /^[A-Z0-9]{12}$/,
    index: true,
  })
  code: string;

  @Prop({ type: Types.ObjectId, ref: 'Store', required: true, index: true })
  storeId: Types.ObjectId;

  @Prop({
    enum: ['unused', 'used', 'expired'],
    default: 'unused',
    required: true
  })
  status: 'unused' | 'used' | 'expired';

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  @Prop({ type: ScratchCardReward, required: true })
  reward: ScratchCardReward;

  @Prop({ enum: ['sms', 'qr'], required: false })
  entryMethod?: 'sms' | 'qr';

  @Prop({ required: true })
  qrUrl: string;

  @Prop({ required: false })
  usedAt?: Date;

  @Prop({ required: true })
  expiresAt: Date;
}

export const ScratchCardSchema = SchemaFactory.createForClass(ScratchCard);
