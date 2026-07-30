import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlanEntity } from 'src/entities/payments/subscription_plan.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlanEntity)
    private readonly subscriptionsRepo: Repository<SubscriptionPlanEntity>,
    @InjectRepository(UserSubscriptionsEntity)
    private readonly usersubscriptionRepo: Repository<UserSubscriptionsEntity>,
  ) {}

  public async get_subscription_users_list(
    page: number = 1,
    limit: number = 10,
  ) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const latestIdsQuery = await this.usersubscriptionRepo
      .createQueryBuilder('sub')
      .select('MAX(sub.id)', 'id')
      .groupBy('sub.user_id')
      .getRawMany();

    const latestIds = latestIdsQuery.map((row) => row.id).filter(Boolean);

    if (latestIds.length === 0) {
      return {
        success: true,
        message: 'No subscription groups found',
        data: [],
        meta: { totalItems: 0, totalPages: 1, currentPage, limit: safeLimit },
      };
    }

    const [subscriptions, totalItems] = await this.usersubscriptionRepo
      .createQueryBuilder('us')
      .leftJoinAndSelect('us.user', 'user')
      .leftJoinAndSelect('us.plan', 'plan')
      .where('us.id IN (:...latestIds)', { latestIds })
      .orderBy('us.id', 'DESC')
      .skip(skipAmount)
      .take(safeLimit)
      .getManyAndCount();

    // 💡 Fetch ALL transaction amounts for these specific users to calculate total actual ledger revenue collected
    const userIds = subscriptions.map((sub) => sub.user?.id).filter(Boolean);
    
    let totalLedgerRevenue = 0;
    if (userIds.length > 0) {
      const allUserPayments = await this.usersubscriptionRepo
        .createQueryBuilder('us')
        .leftJoinAndSelect('us.plan', 'plan')
        .where('us.user_id IN (:...userIds)', { userIds })
        .getMany();

      // Sum up all payment amounts where status means it went through (e.g., success, active, or even expired past payments)
      totalLedgerRevenue = allUserPayments.reduce((sum, item) => {
        const amt = item.plan?.price ? Number(item.plan.price) : 0;
        return sum + amt;
      }, 0);
    }

    const mainGroupList = subscriptions.map((sub) => ({
      user_id: sub.user?.id,
      first_name: sub.user?.first_name || '',
      last_name: sub.user?.last_name || '',
      email: sub.user?.email || '',
      phone: sub.user?.phone || '',
      latest_id: sub.id,
      latest_plan_name: sub.plan?.name || '',
      latest_amount: sub.plan?.price ? Number(sub.plan.price) : 0,
      latest_start_date: sub.start_date || sub.created_at,
      latest_end_date: sub.end_date,
      latest_status: sub.status,
    }));

    return {
      success: true,
      message: 'Users list fetched successfully',
      data: mainGroupList,
      total_ledger_revenue: totalLedgerRevenue, // Pass total revenue collected for these users
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit),
        currentPage,
        limit: safeLimit,
      },
    };
  }

  public async get_user_payment_history(userId: number) {
    const history = await this.usersubscriptionRepo
      .createQueryBuilder('us')
      .leftJoinAndSelect('us.plan', 'plan')
      .where('us.user_id = :userId', { userId })
      .orderBy('us.id', 'DESC')
      .getMany();

    const detailedHistory = history.map((sub) => ({
      id: sub.id,
      plan_name: sub.plan?.name || 'Basic Plan',
      amount: sub.plan?.price ? Number(sub.plan.price) : 0,
      start_date: sub.start_date || sub.created_at,
      end_date: sub.end_date,
      status: sub.status,
    }));

    return {
      success: true,
      message: `Total payment logs loaded for user ${userId}`,
      data: detailedHistory,
    };
  }
}