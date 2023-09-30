import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    

  @Prop({unique: true})
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop() 
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop()
  role: string;

}

export const UserSchema = SchemaFactory.createForClass(User);