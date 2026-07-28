import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PaymentsEntity } from 'src/entities/payments/payment.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PaymentsEntity,
      MemberEntity,
      UserSubscriptionsEntity,
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
