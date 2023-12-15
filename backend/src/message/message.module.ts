import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/auth.schema';
import { Chats, ChatsSchema } from 'src/schemas/chats.schema';
import { GroupChats, GroupChatsSchema } from 'src/schemas/groupChats';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chats.name, schema: ChatsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: GroupChats.name, schema: GroupChatsSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
