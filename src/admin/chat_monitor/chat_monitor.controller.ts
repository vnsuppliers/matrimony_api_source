import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatMonitorService } from './chat_monitor.service';

@UseGuards(JwtAuthGuard)
@Controller('chat-monitor')
export class ChatMonitorController {
  constructor(private readonly chatMonitorService: ChatMonitorService) {}

  @Get('/senders')
  async getSenders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatMonitorService.get_unique_senders(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('/recipients/:userId')
  async getRecipients(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const uId = parseInt(userId, 10);
    return this.chatMonitorService.get_user_chat_recipients(
      isNaN(uId) ? 0 : uId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('/history/:chatId')
  async getHistory(
    @Param('chatId') chatId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const cId = parseInt(chatId, 10);
    return this.chatMonitorService.get_chat_history(
      isNaN(cId) ? 0 : cId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
