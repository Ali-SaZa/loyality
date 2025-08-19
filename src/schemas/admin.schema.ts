import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface AdminDocument extends Admin, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    required: true,
    unique: true,
    match: /^09[0-9]{9}$/,
    index: true,
  })
  phoneNumber: string;

  @Prop({ required: false, trim: true, maxlength: 100 })
  name?: string;

  @Prop({ enum: ['admin'], default: 'admin', required: true })
  role: string;

  @Prop([{
    type: String,
    enum: ['manage_stores', 'view_reports', 'run_lottery', 'manage_users'],
    required: true
  }])
  permissions: Array<'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'>;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
