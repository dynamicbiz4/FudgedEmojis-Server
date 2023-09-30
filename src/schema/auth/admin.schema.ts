import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({timestamps: true})
export class Admin {
    

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

export const AdminSchema = SchemaFactory.createForClass(Admin);