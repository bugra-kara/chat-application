import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from 'src/schemas/auth.schema';
import {
  ERROR,
  SUCCESS,
  SUCCESSFULLY_REGISTERED,
  TRY_AGAIN_REGISTER,
} from 'src/utils/constants';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  public readonly logger = new Logger(AuthService.name);

  async register(
    email: string,
    password: string,
    username: string,
    full_name: string,
  ): Promise<any> {
    try {
      const user: any = await this.create(email, password, username, full_name);
      const { ...result } = user;
      if (result._doc.email === email) {
        return { result: SUCCESS, msg: SUCCESSFULLY_REGISTERED };
      }
      this.logger.log(`New user added. User email: ${email}`);
      return result;
    } catch (error) {
      this.logger.error(`Register failed! msg: ${error}`);
      return {
        result: ERROR,
        msg: TRY_AGAIN_REGISTER,
      };
    }
  }
  async validateUser(
    email: string,
    password: string,
    ip: string,
  ): Promise<any> {
    this.logger.log(`Logging attemp for ${email}`);
    const user: User = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.userModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            login: {
              last_login: user.login.last_login,
              login_attempt: {
                date: new Date(),
                ip: ip,
              },
              last_login_ip: user.login.last_login_ip,
            },
          },
        },
      );
      return null;
    }
    await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          login: {
            last_login: new Date(),
            login_attempt: {
              date: user.login.login_attempt.date,
              ip: user.login.login_attempt.ip,
            },
            last_login_ip: ip,
          },
        },
      },
    );
    this.logger.log(`User logged in ${email}`);
    const { ...result } = user;
    return result;
  }

  async create(
    email: string,
    password: string,
    username: string,
    full_name: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = uuidv4();
    const user = new this.userModel({
      email,
      password: hashedPassword,
      username,
      full_name,
      login: {
        last_login: '',
        last_login_ip: '',
        login_attempt: {
          date: '',
          ip: '',
        },
      },
      uid: uid,
    });
    return await user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async generateJwt(
    email: string,
    id: string,
    userAgent: string,
  ): Promise<any> {
    try {
      const payload = { email: email, sub: id, userAgent };
      const jwt = await this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.SECRET_KEY,
        },
      );
      this.logger.log(`JWT token created for: ${email}`);
      return jwt;
    } catch (error) {
      return false;
    }
  }
}
