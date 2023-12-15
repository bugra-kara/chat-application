import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ApiMiddleware } from './middleware/api.middleware';
import { ChatGateway } from './chat/chat.gateway';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 1300,
      },
    ]),
    UserModule,
    MessageModule,
  ],
  controllers: [],
  providers: [JwtService, ChatGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes('*');
  }
}
