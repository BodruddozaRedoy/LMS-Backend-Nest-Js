import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: false })
  isVerified: boolean;

  // OTP can stay as a string
  @Prop({ type: String, default: null })
  otp: string | null;

  // IMPORTANT: This must be type: Date for $gt queries to work
  @Prop({ type: Date, default: null })
  otpExpires: Date | null;

  @Prop({ type: String, default: null })
  resetToken: string | null;

  // IMPORTANT: This must be type: Date
  @Prop({ type: Date, default: null })
  resetTokenExpires: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
