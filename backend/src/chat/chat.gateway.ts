import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private messageService: MessageService) {}
  public readonly logger = new Logger(ChatGateway.name);
  private onlineUsers: Array<{ id: string; email: string }> = [];
  private onlineGroupUsers = new Map();
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.onlineUsers.push({ id: client.id, email: client.data.email });
    this.notifyOnlineUsers();
  }
  handleDisconnect(client: Socket) {
    this.onlineUsers = this.onlineUsers.filter((e) => e.id !== client.id);
    this.notifyOnlineUsers();
    this.onlineGroupUsers.delete(client.data.email);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_group')
  async handleJoinGroup(
    client: Socket,
    data: { groupId: string },
  ): Promise<void> {
    if (!client.rooms.has(data.groupId)) {
      this.onlineGroupUsers.set(client.data.email, data.groupId);
      client.join(data.groupId);
      this.server
        .to(data.groupId)
        .emit('group_online_members', Array.from(this.onlineGroupUsers));
    } else {
      this.server
        .to(client.id)
        .emit(
          'error',
          JSON.stringify({ msg: 'Already joined or group does not exist!' }),
        );
    }
  }

  @SubscribeMessage('send_group_message')
  async handleSendMessage(
    client: Socket,
    data: { groupId: string; message: string },
  ): Promise<void> {
    const date = new Date();
    this.server.to(data.groupId).emit('receive_group_message', {
      message: data.message,
      email: client.data.email,
      date: date,
    });
    await this.messageService.createSingleMessageForGroup(
      data.groupId,
      client.data.email,
      data.message,
      date,
    );
  }

  @SubscribeMessage('send_private_message')
  async handlePrivateMessage(
    client: Socket,
    data: {
      message: {
        content: string;
        receiver_email: string;
        uid: string;
        date: Date;
      };
    },
  ): Promise<void> {
    const { receiver_email, content, uid, date } = data.message;
    const check = await this.messageService.checkChatAndEmail(
      uid,
      client.data.email,
      receiver_email,
    );
    if (check) {
      const recipientSocketId = this.onlineUsers.filter((e) => {
        return e.email === receiver_email;
      });
      if (recipientSocketId.length > 0) {
        this.server.to(recipientSocketId[0].id).emit(
          'receive_private_message',
          JSON.stringify({
            senderId: client.id,
            content: content,
            date,
          }),
        );
      }
      await this.messageService.createSingleMessageForSingleChat(
        uid.toString(),
        client.data.email,
        receiver_email,
        content.toString(),
        date,
      );
    } else {
      this.server
        .to(client.id)
        .emit('error', JSON.stringify({ msg: 'Chat id is not valid!' }));
    }
  }

  private notifyOnlineUsers() {
    this.server.emit('online_users', this.onlineUsers);
  }
}
