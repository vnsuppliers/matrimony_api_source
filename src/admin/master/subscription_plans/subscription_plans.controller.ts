import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubscriptionPlansService } from './subscription_plans.service';
import { CreateUpdateSubscriptionPlanDto } from 'src/dto/create-update-subscription-plan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('master/subscription-plans')
export class SubscriptionPlansController {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  @Get('/get_master_data')
  async getMasterData(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown> {
    const targetPage = page ? parseInt(page, 10) : 1;
    const targetLimit = limit ? parseInt(limit, 10) : 10;

    // Clean, direct call without any bypasses needed!
    return await this.subscriptionPlansService.get_subscription_plans_master_data(
      targetPage,
      targetLimit,
    );
  }

  @Post('/update-create')
  async updateCreatePlan(
    @Query('id') id: string,
    @Body() payload: CreateUpdateSubscriptionPlanDto,
  ): Promise<unknown> {
    const targetId = id ? parseInt(id, 10) : 0;

    return await this.subscriptionPlansService.update_create_subscription_plans(
      targetId,
      payload,
    );
  }

  @Post('/delete-plan')
  async deletePlan(@Query('id') id: string): Promise<unknown> {
    const targetId = id ? parseInt(id, 10) : 0;

    return await this.subscriptionPlansService.delete_master_data(targetId);
  }

  @Get('/get_plains_list')
  async get_plans_list() {
    return await this.subscriptionPlansService.get_plans_list();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_user_active_plan')
  async get_user_active_plan(@Req() req) {
    return this.subscriptionPlansService.getUserActivePlan(req.user.id);
  }
}
