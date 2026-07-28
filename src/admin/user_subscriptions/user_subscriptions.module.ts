import { Module } from '@nestjs/common';
import { UserSubscriptionsService } from './user_subscriptions.service';
import { UserSubscriptionsController } from './user_subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';
import { SubscriptionPlanEntity } from 'src/entities/payments/subscription_plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSubscriptionsEntity,
      SubscriptionPlanEntity,
    ]),
  ],
  providers: [UserSubscriptionsService],
  controllers: [UserSubscriptionsController],
})
export class UserSubscriptionsModule {}
