import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { globalTransformPlugin } from "./global-transform.plugin";

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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

  @Prop({
    enum: ["customer", "store", "admin"],
    default: "customer",
    required: true,
  })
  role: string;

  @Prop({
    enum: ["active", "blocked", "deleted"],
    default: "active",
    required: true,
    index: true,
  })
  status: string;

  @Prop({ required: true, default: Date.now })
  lastActivity: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Apply global transform plugin
UserSchema.plugin(globalTransformPlugin);
