import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @Prop()
  username: string;
  @Prop()
  passwordHash: string;
  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
