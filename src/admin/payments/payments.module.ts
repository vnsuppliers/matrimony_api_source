import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PaymentsEntity } from 'src/entities/payments/payment.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';
import { SubscriptionPlanEntity } from 'src/entities/payments/subscription_plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PaymentsEntity,
      UserSubscriptionsEntity,
      SubscriptionPlanEntity,
    ]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
