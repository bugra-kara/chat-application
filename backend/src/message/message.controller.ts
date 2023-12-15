import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ERROR, SUCCESS, UNEXPECTED_ERROR } from 'src/utils/constants';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  public readonly logger = new Logger(MessageController.name);

  @UseGuards(AuthGuard)
  @Post('createSingleUserChat')
  async createSingleUserChat(
    @Body() body: { user: string },
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const email = req.user.email;
      const response: any = await this.messageService.createSingleChat([
        email,
        body.user,
      ]);
      if (response.status === SUCCESS) {
        res.status(201);
        res.send(response);
      } else {
        res.status(200);
        res.send(response);
      }
    } catch (error) {
      res.status(400);
      res.send({ status: ERROR, msg: error.toString() });
    }
  }

  @UseGuards(AuthGuard)
  @Get('userMessages')
  async getUserMessages(@Res() res: Response, @Req() req: any) {
    try {
      const response = await this.messageService.getSingleChats(req.user.email);
      if (response.status === SUCCESS) {
        res.status(200);
        res.send({ response });
      } else {
        res.status(400);
        res.send({ response });
      }
    } catch (error) {
      res.status(400);
      res.send({ status: ERROR, msg: UNEXPECTED_ERROR });
    }
  }

  @UseGuards(AuthGuard)
  @Post('getSingleUserMessages')
  async sendSingleUserMessage(
    @Body() body: { uid: string },
    @Res() res: Response,
    @Req() req: Request | any,
  ) {
    try {
      const response = await this.messageService.getSingleChat(
        req.user.email,
        body.uid,
      );
      if (response.status === SUCCESS) {
        res.status(200);
        res.send({ response });
      } else {
        res.status(400);
        res.send({ response });
      }
    } catch (error) {
      res.status(400);
      res.send({ status: ERROR, msg: UNEXPECTED_ERROR });
    }
  }

  @UseGuards(AuthGuard)
  @Get('groupMessages')
  async getGroupMessages(@Res() res: Response) {
    try {
      const response: any = await this.messageService.getGroupChats();
      if (response.status === SUCCESS) {
        res.status(200);
        res.send(response);
      } else {
        res.status(400);
        res.send(response);
      }
    } catch (error) {
      res.status(400);
      res.send({ status: ERROR, msg: error.toString() });
    }
  }

  @UseGuards(AuthGuard)
  @Post('getGroupMessage')
  async getSingleGroupMessage(
    @Body() body: { uid: string },
    @Res() res: Response,
  ) {
    try {
      const response: any = await this.messageService.getSingleGroupChat(
        body.uid,
      );
      if (response.status === SUCCESS) {
        res.status(200);
        res.send(response);
      } else {
        res.status(400);
        res.send(response);
      }
    } catch (error) {
      res.status(400);
      res.send({ status: ERROR, msg: error.toString() });
    }
  }

  @UseGuards(AuthGuard)
  @Post('createGroupChat')
  async createGroupChat(@Body() body: { name: string }, @Res() res: Response) {
    try {
      const response: any = await this.messageService.createGroupChat(
        body.name,
      );
      if (response.status === SUCCESS) {
        res.status(201);
        res.send(response);
      } else {
        res.status(400);
        res.send(response);
      }
    } catch (error) {
      res.status(400);
      res.send({ status: ERROR, msg: error.toString() });
    }
  }
}
