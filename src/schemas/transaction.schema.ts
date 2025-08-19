import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Store', required: true, index: true })
  storeId: Types.ObjectId;

  @Prop({
    enum: ['purchase', 'cashback', 'lottery'],
    required: true
  })
  type: 'purchase' | 'cashback' | 'lottery';

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: false })
  scratchCode?: string;

  @Prop({ enum: ['sms', 'qr'], required: true })
  entryMethod: 'sms' | 'qr';

  @Prop({ required: false })
  description?: string;

  @Prop({ default: Date.now, index: true })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
