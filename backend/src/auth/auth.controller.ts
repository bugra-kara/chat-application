import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
  Logger,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  EMAIL_OR_PASSWORD_ERROR,
  ERROR,
  SUCCESS,
  UNEXPECTED_ERROR,
  USER_LOGGED_OUT,
} from 'src/utils/constants';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthGuard } from './guard/auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  public readonly logger = new Logger(AuthController.name);

  @Post('login')
  async login(
    @Body() body: SignInDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
      req.ip,
    );
    if (user !== null) {
      const token: any = await this.authService.generateJwt(
        user._doc.email,
        user._doc.uid,
        req.headers['user-agent'],
      );
      if (token !== false) {
        const exp_date_one_day = 1000 * 60 * 60 * 24 * 1;
        res.clearCookie('access_token');
        res.cookie('access_token', token, {
          httpOnly: false, // true for prod
          secure: true,
          expires: new Date(Date.now() + exp_date_one_day),
          sameSite: 'none', // Lax for prod
        });
        res.status(200);
        res.send({
          status: SUCCESS,
          access_token: token,
          email: user._doc.email,
        });
      } else {
        res.status(400);
        res.send({
          status: ERROR,
          msg: UNEXPECTED_ERROR,
        });
      }
    } else {
      res.status(400);
      res.send({
        status: ERROR,
        msg: EMAIL_OR_PASSWORD_ERROR,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token');
    res.status(200);
    res.send({ status: SUCCESS, msg: USER_LOGGED_OUT });
  }

  @Post('register')
  async register(@Body() body: SignUpDto) {
    return this.authService.register(
      body.email,
      body.password,
      body.username,
      body.full_name,
    );
  }

  @UseGuards(AuthGuard)
  @Get('checkUser')
  async checkUser(@Req() req: any, @Res() res: Response) {
    const email = req?.user?.email;
    if (email !== undefined && email !== null) {
      const user = this.authService.findByEmail(email);
      if (user) {
        res.status(200);
        res.send({ status: SUCCESS });
      } else {
        res.clearCookie('access_token');
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
