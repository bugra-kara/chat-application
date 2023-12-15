import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const cookieToken = this.extractTokenFromCookie(request);
    const userAgent = this.extractUserAgentFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    if (!cookieToken) {
      throw new UnauthorizedException();
    }
    if (token === cookieToken) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.SECRET_KEY,
        });
        if (payload.userAgent === userAgent) {
          request['user'] = payload;
          return true;
        } else {
          throw new UnauthorizedException();
        }
      } catch {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.headers?.cookie?.split('=')[1];
    return token ? token : undefined;
  }
  private extractUserAgentFromHeader(request: Request): string | undefined {
    const userAgent = request.headers?.['user-agent'];
    return userAgent ? userAgent : undefined;
  }
}
