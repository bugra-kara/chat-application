import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/auth.schema';
import { ERROR, SUCCESS, UNEXPECTED_ERROR } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  public readonly logger = new Logger(UserService.name);
  async getAllUsers(): Promise<any> {
    try {
      const users = await this.userModel.find({}, { email: 1, username: 1 });
      return { status: SUCCESS, data: users };
    } catch (error) {
      this.logger.error(`Get users failed! msg: ${error}`);
      return {
        result: ERROR,
        msg: UNEXPECTED_ERROR,
      };
    }
  }
}
