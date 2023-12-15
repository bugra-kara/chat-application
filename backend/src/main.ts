import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthAdapter } from './chat/adapters/auth.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whitelist: any = process.env.WHITE_LIST.split(',');
  app.use(bodyParser.json());
  app.enableCors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) === -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: [
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, api-key, Authorization',
    ],
    methods: ['GET,PUT,POST,DELETE,UPDATE,OPTIONS'],
    credentials: true,
  });
  const globalPrefix = 'api';
  const port = process.env.PORT;
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(express.json());
  app.useWebSocketAdapter(new AuthAdapter(app));
  await app.listen(port);
  Logger.log(`Application is running on: ${port}`);
}
bootstrap();
