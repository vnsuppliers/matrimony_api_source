import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThanOrEqual } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

import { PaymentsEntity } from 'src/entities/payments/payment.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';
import { SubscriptionPlanEntity } from 'src/entities/payments/subscription_plan.entity';
import { User } from 'src/entities/user.entity';

import { CreateOrderDto } from 'src/dto/payments/create-order.dto';
import { VerifyPaymentDto } from 'src/dto/payments/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    @InjectRepository(PaymentsEntity)
    private readonly paymentsRepository: Repository<PaymentsEntity>,

    @InjectRepository(UserSubscriptionsEntity)
    private readonly userSubscriptionsRepository: Repository<UserSubscriptionsEntity>,

    @InjectRepository(SubscriptionPlanEntity)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(userId: number, dto: CreateOrderDto) {
    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id: dto.plan_id },
    });

    if (!plan) throw new NotFoundException('Subscription plan not found.');
    if (plan.status !== 1)
      throw new BadRequestException('Subscription plan is inactive.');

    const order = await this.razorpay.orders.create({
      amount: Number(plan.price) * 100,
      currency: 'INR',
      receipt: `plan_${plan.id}_user_${userId}_${Date.now()}`,
    });

    const payment = this.paymentsRepository.create({
      user_id: userId,
      plan_id: plan.id,
      amount: Number(plan.price),
      currency: 'INR',
      payment_gateway: 'razorpay',
      gateway_order_id: order.id,
      status: 'pending',
    });

    await this.paymentsRepository.save(payment);

    return {
      success: true,
      message: 'Order created successfully.',
      data: {
        payment_id: payment.id,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        plan,
      },
    };
  }

  async verifyPayment(userId: number, dto: VerifyPaymentDto) {
    const payment = await this.paymentsRepository.findOne({
      where: { gateway_order_id: dto.order_id, user_id: userId },
    });

    if (!payment) throw new NotFoundException('Payment record not found.');

    // Validate the cryptographic signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.order_id}|${dto.payment_id}`)
      .digest('hex');

    if (generatedSignature !== dto.signature) {
      throw new BadRequestException(
        'Invalid payment signature verification failed.',
      );
    }

    payment.gateway_payment_id = dto.payment_id;
    payment.gateway_signature = dto.signature;
    payment.status = 'success';
    await this.paymentsRepository.save(payment);

    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id: payment.plan_id },
    });
    if (!plan)
      throw new NotFoundException(
        'Subscription plan configuration mapping lost.',
      );

    // Execute database logic inside an isolated atomic transaction block
    return await this.paymentsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Fetch the current running active subscription
        const currentActiveSub = await transactionalEntityManager.findOne(
          UserSubscriptionsEntity,
          {
            where: { user_id: userId, status: 'active' },
          },
        );

        let startDate: Date;
        let endDate: Date;
        const now = new Date();

        if (currentActiveSub && new Date(currentActiveSub.end_date) > now) {
          /**
           * REAL-WORLD RENEWAL / EARLY STACKING PIPELINE:
           * The user is purchasing days ahead of schedule.
           * Calculate new timeline starting exactly where their previous purchase left off.
           */
          startDate = new Date(currentActiveSub.end_date);
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + Number(plan.duration_days));

          // Downgrade the older record immediately so it won't conflict with queries or cron loops
          currentActiveSub.status = 'expired';
          await transactionalEntityManager.save(currentActiveSub);
        } else {
          /**
           * FRESH CLEAN START PIPELINE:
           * User has never bought a plan before, or their old plan completely ran out.
           */
          startDate = now;
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + Number(plan.duration_days));

          // Safety step: In case an old expired/past_due subscription was left active due to server crashes
          if (currentActiveSub) {
            currentActiveSub.status = 'expired';
            await transactionalEntityManager.save(currentActiveSub);
          }
        }

        // Create the single newly unified Active premium record line
        const subscription = transactionalEntityManager.create(
          UserSubscriptionsEntity,
          {
            user_id: userId,
            plan_id: plan.id,
            payment_id: payment.id,
            start_date: startDate,
            end_date: endDate,
            status: 'active',
          },
        );
        await transactionalEntityManager.save(subscription);

        // Turn on global application access switches
        await transactionalEntityManager.update(
          User,
          { id: userId },
          { is_premium: 1 },
        );

        return {
          success: true,
          message: 'Subscription dynamically calculated and securely stacked.',
          data: subscription,
        };
      },
    );
  }

  async getMySubscription(userId: number) {
    const subscription = await this.userSubscriptionsRepository.findOne({
      where: { user_id: userId, status: 'active' },
      relations: ['plan'],
      order: { id: 'DESC' },
    });

    if (!subscription)
      throw new NotFoundException('No active membership found.');

    return {
      success: true,
      data: subscription,
    };
  }

  /**
   * AUTOMATIC CRON SCHEDULER: Evaluates and downgrades expired accounts at midnight
   */
  @Cron('0 * * * * *') // Every minute
  async autoExpireSubscriptions() {
    const now = new Date();

    const expiredSubscriptions = await this.userSubscriptionsRepository.find({
      where: {
        status: 'active',
        end_date: LessThanOrEqual(now),
      },
      select: ['id', 'user_id'],
    });

    if (!expiredSubscriptions.length) {
      return;
    }

    const userIds = [...new Set(expiredSubscriptions.map((x) => x.user_id))];

    await this.userSubscriptionsRepository.manager.transaction(
      async (manager) => {
        await manager.update(
          UserSubscriptionsEntity,
          {
            status: 'active',
            end_date: LessThanOrEqual(now),
          },
          {
            status: 'expired',
          },
        );

        await manager.update(
          User,
          {
            id: In(userIds),
          },
          {
            is_premium: 0,
          },
        );
      },
    );

    // console.log(`Expired ${userIds.length} subscriptions`);
  }
}
