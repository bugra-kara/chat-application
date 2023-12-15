import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    const secretKey = req.headers['api-token'];
    if (secretKey === process.env.API_TOKEN) {
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
