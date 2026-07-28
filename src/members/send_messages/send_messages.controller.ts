import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SendMessagesService } from './send_messages.service';
import { PremiumGuard } from 'src/auth/guards/premium.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

@Controller('send-messages')
@UseGuards(JwtAuthGuard, PremiumGuard, AccountStatusGuard)
export class SendMessagesController {
  constructor(private readonly service: SendMessagesService) {}

  // THREAD LIST
  @Get()
  getThreads(@Req() req: any) {
    return this.service.getMessagesByGender(req.user.id);
  }

  // GET OR CREATE CHAT
  @Get('chat/:userId')
  getChat(@Req() req: any, @Param('userId') userId: number) {
    return this.service.getOrCreateChat(req.user.id, Number(userId));
  }

  // GET MESSAGES
  @Get('messages/:chatId')
  getMessages(@Param('chatId') chatId: number) {
    return this.service.getMessages(Number(chatId));
  }

  // SEND MESSAGE
  @Post('messages')
  sendMessage(@Req() req: any, @Body() body: any) {
    return this.service.sendMessage(body.chatId, req.user.id, body.message);
  }
}
