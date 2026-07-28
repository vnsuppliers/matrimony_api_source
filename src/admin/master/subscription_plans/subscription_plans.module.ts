import { Module } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription_plans.service';
import { SubscriptionPlansController } from './subscription_plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanEntity } from 'src/entities/payments/subscription_plan.entity';
import { User } from 'src/entities/user.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlanEntity,
      User,
      UserSubscriptionsEntity,
    ]),
  ],
  providers: [SubscriptionPlansService],
  controllers: [SubscriptionPlansController],
})
export class SubscriptionPlansModule {}
