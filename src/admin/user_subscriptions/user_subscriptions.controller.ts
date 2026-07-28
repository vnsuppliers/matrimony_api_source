import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserSubscriptionsService } from './user_subscriptions.service';

@UseGuards(JwtAuthGuard)
@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  @Get('/get-user-subscriptions')
  async get_subscriptions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const targetPage = page ? parseInt(page, 10) : 1;
    const targetLimit = limit ? parseInt(limit, 10) : 10;
    return await this.userSubscriptionsService.get_subscription_users_list(
      targetPage,
      targetLimit,
    );
  }

  // New lazy endpoint route targeting individual users history ledgers on call
  @Get('/history/:userId')
  async get_user_history(@Param('userId') userId: string) {
    return await this.userSubscriptionsService.get_user_payment_history(
      parseInt(userId, 10),
    );
  }
}
