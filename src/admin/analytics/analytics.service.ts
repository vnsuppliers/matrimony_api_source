import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PaymentsEntity } from 'src/entities/payments/payment.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(PaymentsEntity)
    private readonly paymentRepo: Repository<PaymentsEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
    @InjectRepository(UserSubscriptionsEntity)
    private readonly subRepo: Repository<UserSubscriptionsEntity>,
  ) {}

  public async getDashboardSummary() {
    const totalUsers = await this.userRepo.count({
      where: { deleted_at: null },
    });

    const activeUsers = await this.userRepo.count({
      where: { is_online: 1, deleted_at: null },
    });

    const pendingUsers = await this.userRepo.count({
      where: { is_verified: 0, deleted_at: null },
    });

    const premiumUsers = await this.userRepo.count({
      where: { is_premium: 1, deleted_at: null },
    });

    // console.log(premiumUsers);

    const suspendedUsers = await this.userRepo.count({
      where: {
        account_status: ILike('%suspended%'),
        deleted_at: null,
      },
    });

    // console.log(suspendedUsers);

    const revenueRaw = await this.paymentRepo
      .createQueryBuilder('p')
      .select('SUM(CAST(p.amount AS NUMERIC))', 'total')
      .where('p.status = :status', { status: 'success' })
      .getRawOne<{ total: string }>();
    const totalRevenue = revenueRaw?.total ? parseFloat(revenueRaw.total) : 0;

    //  Monthly Registrations Trend (Last 6 Months)
    const monthlyRegistrations = await this.userRepo
      .createQueryBuilder('u')
      .select("TO_CHAR(u.created_at, 'Mon')", 'month')
      .addSelect("TO_CHAR(u.created_at, 'MM')", 'month_num')
      .addSelect('COUNT(u.id)', 'count')
      .where("u.created_at >= NOW() - INTERVAL '6 months'")
      .groupBy("TO_CHAR(u.created_at, 'Mon'), TO_CHAR(u.created_at, 'MM')")
      .orderBy("TO_CHAR(u.created_at, 'MM')", 'ASC')
      .getRawMany();

    //  Revenue Growth Trend (Last 6 Months)
    const revenueGrowth = await this.paymentRepo
      .createQueryBuilder('p')
      .select("TO_CHAR(p.created_at, 'Mon')", 'month')
      .addSelect("TO_CHAR(p.created_at, 'MM')", 'month_num')
      .addSelect('SUM(CAST(p.amount AS NUMERIC))', 'amount')
      .where('p.status = :status', { status: 'success' })
      .andWhere("p.created_at >= NOW() - INTERVAL '6 months'")
      .groupBy("TO_CHAR(p.created_at, 'Mon'), TO_CHAR(p.created_at, 'MM')")
      .orderBy("TO_CHAR(p.created_at, 'MM')", 'ASC')
      .getRawMany();

    //  Bride vs Groom Distribution (Safely matching up against the GenderEntity)
    const genderRaw = await this.memberRepo
      .createQueryBuilder('member')
      .innerJoin('member.gender', 'gender')
      .select('gender.name', 'type')
      .addSelect('COUNT(member.id)', 'count')
      .where('member.deleted_at IS NULL')
      .groupBy('gender.name')
      .getRawMany();

    const profileDistribution = genderRaw.map((g) => ({
      type: g.type || '',
      count: parseInt(g.count, 10) || 0,
    }));

    // 5. Subscription Breakdown by Active Plans
    const plansRaw = await this.subRepo
      .createQueryBuilder('us')
      .innerJoin('us.plan', 'plan')
      .select('plan.name', 'plan')
      .addSelect('COUNT(us.id)', 'count')
      .where('us.status = :status', { status: 'active' })
      .groupBy('plan.name')
      .getRawMany();

    return {
      success: true,
      data: {
        total_users: totalUsers,
        active_users: activeUsers,
        pending_users: pendingUsers,
        premium_users: premiumUsers,
        suspended_users: suspendedUsers,
        total_revenue: totalRevenue,
        monthly_registrations: monthlyRegistrations.map((r) => ({
          month: r.month,
          count: parseInt(r.count, 10) || 0,
        })),
        revenue_growth: revenueGrowth.map((g) => ({
          month: g.month,
          amount: parseFloat(g.amount) || 0,
        })),
        profile_distribution: profileDistribution.length
          ? profileDistribution
          : [
              { type: 'Bride', count: 0 },
              { type: 'Groom', count: 0 },
            ],
        subscription_breakdown: plansRaw.map((p) => ({
          plan: p.plan,
          count: parseInt(p.count, 10) || 0,
        })),
      },
    };
  }
}
