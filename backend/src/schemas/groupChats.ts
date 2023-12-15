import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GroupChatsDocument = HydratedDocument<GroupChats>;

@Schema({ timestamps: true })
export class GroupChats {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: [] })
  messages: Array<{ email: string; content: string; date: Date }>;

  @Prop({ required: true })
  uuid: string;
}

export const GroupChatsSchema = SchemaFactory.createForClass(GroupChats);
