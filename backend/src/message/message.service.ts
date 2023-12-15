import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/auth.schema';
import { Chats, ChatsDocument } from 'src/schemas/chats.schema';
import { GroupChats, GroupChatsDocument } from 'src/schemas/groupChats';
import { ERROR, SUCCESS, UNEXPECTED_ERROR } from 'src/utils/constants';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Chats.name) private readonly chatModel: Model<ChatsDocument>,
    @InjectModel(GroupChats.name)
    private readonly groupChatModal: Model<GroupChatsDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  public readonly logger = new Logger(MessageService.name);

  async createSingleChat(users: Array<string>): Promise<any> {
    try {
      const [first, second] = await Promise.all(
        users.map(async (e) => {
          return await this.userModel.findOne(
            { email: e },
            { email: 1, status: 1 },
          );
        }),
      );
      if (first.email !== second.email) {
        if (first?.status === '1' && second?.status === '1') {
          const chatExist = await this.chatModel.findOne({
            users: { $all: [first.email, second.email] },
          });
          if (chatExist) {
            return {
              status: ERROR,
              msg: 'Chat already exist!',
              uid: chatExist.uid,
            };
          } else {
            const uid = uuidv4();
            const chat = await this.chatModel.create({
              users: users,
              messages: [],
              uid,
            });
            await Promise.all(
              users.map(async (e) => {
                await this.userModel.findOneAndUpdate(
                  { email: e },
                  { $push: { chats: chat.uid } },
                );
              }),
            );
            return { status: SUCCESS, msg: 'Chat created', uid: chat.uid };
          }
        } else {
          return { status: ERROR, msg: 'User does not exist!' };
        }
      } else
        return { status: ERROR, msg: 'You can not create chat for same user' };
    } catch (error) {
      this.logger.error(
        `Something happened when trying to create chat: ${error.toString()}`,
      );
      return { status: ERROR, msg: UNEXPECTED_ERROR };
    }
  }
  async getSingleChats(user: string): Promise<any> {
    try {
      const singleChats = await this.chatModel.find(
        {
          users: { $in: [user] },
        },
        { uid: 1, users: 1 },
      );
      return { status: SUCCESS, data: singleChats };
    } catch (error) {
      return { status: ERROR, msg: UNEXPECTED_ERROR };
    }
  }
  async getSingleChat(user: string, uid: string): Promise<any> {
    try {
      const singleChats = await this.chatModel.find(
        {
          users: { $in: [user] },
          uid: uid,
        },
        { uid: 1, users: 1, messages: 1 },
      );
      return { status: SUCCESS, data: singleChats };
    } catch (error) {
      return { status: ERROR, msg: UNEXPECTED_ERROR };
    }
  }
  async createSingleMessageForSingleChat(
    uid: string,
    sender_email: string,
    receiver_email: string,
    content: string,
    date: Date,
  ): Promise<void> {
    try {
      await this.chatModel.findOneAndUpdate(
        { uid: uid, users: { $all: [sender_email, receiver_email] } },
        { $push: { messages: { sender_email, content, date: date } } },
      );
    } catch (error) {
      this.logger.error(
        `Something happened when trying to save single message: ${error.toString()}`,
      );
    }
  }
  async checkChatAndEmail(
    uid: string,
    sender_email: string,
    receiver_email: string,
  ): Promise<any> {
    try {
      const response = await this.chatModel.findOne(
        {
          uid: uid,
          users: { $all: [sender_email, receiver_email] },
        },
        { uid: 1 },
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Something happened when trying to save single message: ${error.toString()}`,
      );
    }
  }
  async createGroupChat(name: string): Promise<any> {
    try {
      const isGroupNameExist = await this.groupChatModal.find({ name });
      if (Array.isArray(isGroupNameExist) && isGroupNameExist.length === 0) {
        const uuid = uuidv4();
        await this.groupChatModal.create({ name, uuid });
        return { status: SUCCESS, msg: 'Group chat created!', uuid: uuid };
      } else
        return { status: ERROR, msg: 'You can not create chat for same name' };
    } catch (error) {
      return { status: ERROR, msg: UNEXPECTED_ERROR };
    }
  }
  async getGroupChats(): Promise<any> {
    try {
      const groupChats = await this.groupChatModal.find(
        {},
        { name: 1, uuid: 1 },
      );
      return { status: SUCCESS, data: groupChats };
    } catch (error) {
      return { status: ERROR, msg: UNEXPECTED_ERROR };
    }
  }
  async getSingleGroupChat(uuid: string): Promise<any> {
    try {
      const messages = await this.groupChatModal.find(
        { uuid },
        { name: 1, uid: 1, messages: 1 },
      );
      return { status: SUCCESS, data: messages };
    } catch (error) {
      return { status: ERROR, msg: UNEXPECTED_ERROR };
    }
  }
  async createSingleMessageForGroup(
    uuid: string,
    email: string,
    content: string,
    date: Date,
  ): Promise<void> {
    try {
      await this.groupChatModal.findOneAndUpdate(
        { uuid: uuid },
        { $push: { messages: { email, content, date: date } } },
      );
    } catch (error) {
      this.logger.error(
        `Something happened when trying to save group message: ${error.toString()}`,
      );
    }
  }
}
