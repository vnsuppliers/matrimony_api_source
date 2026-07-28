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

  /**
   * Get unique users list with their absolute LATEST subscription details
   */
  public async get_subscription_users_list(
    page: number = 1,
    limit: number = 10,
  ) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    // Subquery to extract only the MAX(id) per user_id (the latest transaction)
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

    // Paginate and load the complete entity schemas matching those specific IDs
    const [subscriptions, totalItems] = await this.usersubscriptionRepo
      .createQueryBuilder('us')
      .leftJoinAndSelect('us.user', 'user')
      .leftJoinAndSelect('us.plan', 'plan')
      .where('us.id IN (:...latestIds)', { latestIds })
      .orderBy('us.id', 'DESC')
      .skip(skipAmount)
      .take(safeLimit)
      .getManyAndCount();

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
      message: 'Grouped users list fetched successfully',
      data: mainGroupList,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit),
        currentPage,
        limit: safeLimit,
      },
    };
  }

  /**
   * API Get total payments history list for a SINGLE user on-demand
   */
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
