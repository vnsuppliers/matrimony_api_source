import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

interface JwtRequest extends Request {
  user: {
    id: number;
  };
}

@UseGuards(JwtAuthGuard, AccountStatusGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get()
  async get(@Req() req: JwtRequest) {
    return this.service.getUserNotifications(req.user.id);
  }

  @Post('read-all')
  async markRead(@Req() req: JwtRequest) {
    return this.service.markAllAsRead(req.user.id);
  }
}
