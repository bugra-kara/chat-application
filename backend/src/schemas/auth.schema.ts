import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true, minlength: 3, maxlength: 25 })
  username: string;

  @Prop({ required: true, minlength: 3, maxlength: 70 })
  full_name: string;

  @Prop({
    type: {},
  })
  login: {
    last_login: string;
    login_attempt: {
      date: string;
      ip: string;
    };
    last_login_ip: string;
  };

  @Prop({ default: [] })
  chats: Array<string>;

  @Prop({ default: '1' })
  status: '0' | '1';

  @Prop({ required: true })
  uid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
