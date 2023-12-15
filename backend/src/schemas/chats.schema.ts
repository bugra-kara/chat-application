import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatsDocument = HydratedDocument<Chats>;

@Schema({ timestamps: true })
export class Chats {
  @Prop({ required: true, length: 2 })
  users: Array<string>;

  @Prop({ required: true })
  messages: Array<{ email: string; content: string }>;

  @Prop({ required: true })
  uid: string;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
