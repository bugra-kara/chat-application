import { IoAdapter } from '@nestjs/platform-socket.io';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export class AuthAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, { ...options, cors: true });
    server.use((socket: Socket, next: any) => {
      if (
        socket.handshake.headers['bearer-token'] &&
        socket.handshake.headers['api-key']
      ) {
        verify(
          socket.handshake.headers['bearer-token'] as string,
          process.env.SECRET_KEY,
          (err, decoded: any) => {
            if (
              err ||
              socket.handshake.headers['api-key'] !== process.env.API_KEY
            ) {
              next(new Error('Authentication error'));
            } else {
              socket.data.email = decoded.email;
              next();
            }
          },
        );
      } else {
        next(new Error('Authentication error'));
      }
    });
    return server;
  }
}
