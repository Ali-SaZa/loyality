import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { globalTransformPlugin } from './global-transform.plugin';

export interface OtpDocument extends Otp, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Otp {
  @Prop({
    required: true,
    match: /^09[0-9]{9}$/,
    index: true,
  })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  @Prop({
    required: true,
    match: /^[0-9]{6}$/
  })
  code: string;

  @Prop({
    enum: ['login', 'scratch'],
    required: true
  })
  context: 'login' | 'scratch';

  @Prop({ required: false })
  scratchCode?: string;

  @Prop({
    enum: ['sent', 'verified', 'expired'],
    default: 'sent',
    required: true
  })
  status: 'sent' | 'verified' | 'expired';

  @Prop({ required: true })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Apply global transform plugin
OtpSchema.plugin(globalTransformPlugin);

// Add TTL index for automatic cleanup after 5 minutes
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
