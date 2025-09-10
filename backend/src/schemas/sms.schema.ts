import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type SmsDocument = Sms & Document;

@Schema({ timestamps: true })
export class Sms {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ required: true })
  providerResponse: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;
}

export const SmsSchema = SchemaFactory.createForClass(Sms);

// Indexes for better performance
SmsSchema.index({ userId: 1, createdAt: -1 });
SmsSchema.index({ createdBy: 1 });
