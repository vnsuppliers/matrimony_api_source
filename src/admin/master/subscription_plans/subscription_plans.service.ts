import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateSubscriptionPlanDto } from 'src/dto/create-update-subscription-plan.dto';
import { SubscriptionPlanEntity } from 'src/entities/payments/subscription_plan.entity';
import { UserSubscriptionsEntity } from 'src/entities/payments/user_subscription.entity';
import { Repository, Not } from 'typeorm';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlanEntity)
    private readonly subscriptionPlanRepo: Repository<SubscriptionPlanEntity>,
    @InjectRepository(UserSubscriptionsEntity)
    private readonly userSubscriptionPlanRepo: Repository<UserSubscriptionsEntity>,
  ) {}

  public async update_create_subscription_plans(
    id: number,
    payload: CreateUpdateSubscriptionPlanDto & { specifications?: string[] }, // Accept dynamic tag values
  ) {
    const trimmedName = payload.name.trim();
    // Safely fallback to an empty array context map if null values drift downstream
    const targetSpecs = Array.isArray(payload.specifications)
      ? payload.specifications
      : [];

    if (id > 0) {
      // ==========================================
      // UPDATE PIPELINE
      // ==========================================
      const plan = await this.subscriptionPlanRepo.findOne({
        where: { id: id },
      });
      if (!plan) {
        throw new NotFoundException(`Subscription plan ID:${id} not found`);
      }

      // Check name conflict across different plans
      const nameConflict = await this.subscriptionPlanRepo.findOne({
        where: { name: trimmedName, id: Not(id) },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A subscription plan named '${trimmedName}' already exists`,
        );
      }

      // Merge data payload along with specifications text array array maps
      plan.name = trimmedName;
      plan.description = payload.description;
      plan.price = payload.price;
      plan.duration_days = payload.duration_days;
      plan.status = payload.status;
      plan.specifications = targetSpecs;

      const sss = await this.subscriptionPlanRepo.save(plan);
      // console.log(sss);

      return {
        message: 'Subscription plan updated successfully',
        status: true,
      };
    } else {
      // ==========================================
      // CREATE PIPELINE
      // ==========================================
      const nameConflict = await this.subscriptionPlanRepo.findOne({
        where: { name: trimmedName },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A subscription plan named '${trimmedName}' already exists`,
        );
      }

      // Safe Auto-Increment Key Mismatch bypass query handler
      const result = await this.subscriptionPlanRepo
        .createQueryBuilder('plan')
        .select('MAX(plan.id)', 'maxId')
        .getRawOne<{ maxId: string | null }>();

      const currentMaxId = result?.maxId ? parseInt(result.maxId, 10) : 0;
      const nextId = currentMaxId + 1;

      // Instantiate using safe hardcoded increment index along with specifications array maps
      const newPlan = this.subscriptionPlanRepo.create({
        id: nextId,
        name: trimmedName,
        description: payload.description,
        price: payload.price,
        duration_days: payload.duration_days,
        status: payload.status,
        specifications: targetSpecs,
      });

      await this.subscriptionPlanRepo.save(newPlan);
      return {
        message: 'New subscription plan created successfully',
        status: true,
      };
    }
  }

  /**
   * Fetches paginated subscription plan listings for the admin grid
   */
  async get_subscription_plans_master_data(
    page: number = 1,
    limit: number = 10,
  ) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const [masterData, totalItems] =
      await this.subscriptionPlanRepo.findAndCount({
        order: { id: 'DESC' },
        take: safeLimit,
        skip: skipAmount,
      });

    // Clean decimals back to pure numeric values safely across responses map array formats
    const sanitizedData = (masterData || []).map((plan) => ({
      ...plan,
      price: Number(plan.price),
    }));

    return {
      masterData: sanitizedData,
      meta: {
        totalItems: totalItems || 0,
        totalPages: Math.ceil((totalItems || 0) / safeLimit),
        currentPage: currentPage,
        limit: safeLimit,
      },
    };
  }

  /**
   * Hard-deletes a subscription plan entry from the database
   */
  async delete_master_data(id: number) {
    const plan = await this.subscriptionPlanRepo.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(
        `Subscription Plan tracking ID:${id} does not exist`,
      );
    }

    await this.subscriptionPlanRepo.delete(plan.id);
    return {
      message: 'Subscription plan successfully purged from system files',
      status: true,
    };
  }

  /**
   * Get active plans to public landing pages users
   */
  public async get_plans_list() {
    const plans = await this.subscriptionPlanRepo.find({
      where: { status: 1 },
      order: { id: 'ASC' },
    });

    // Logical gate fallback bug prevents crashes when array length tracks empty elements
    if (!plans || plans.length === 0) {
      return {
        message: 'No plans exists',
        success: true,
        plans_list: [],
      };
    }

    // Explicitly enforce numeric types instead of continuous text block structures across database boundaries
    const plans_list = plans.map((plan) => ({
      ...plan,
      price: Number(plan.price),
      specifications: Array.isArray(plan.specifications)
        ? plan.specifications
        : [],
    }));

    return {
      success: true,
      plans_list,
    };
  }

  // get users active plan.
  public async getUserActivePlan(userId: number) {
    try {
      const subscription = await this.userSubscriptionPlanRepo.findOne({
        where: {
          user_id: userId,
          status: 'active',
        },
        relations: ['plan'],
        order: {
          id: 'DESC',
        },
      });

      // console.log('Database subscription record found:', subscription);

      //  If no subscription record exists or the relationship layout is missing
      if (!subscription || !subscription.plan) {
        return {
          success: true,
          hasActivePlan: false,
          data: null,
        };
      }

      // Secure wrapper mapping payload data cleanly
      return {
        success: true,
        hasActivePlan: true,
        data: {
          ...subscription.plan,
          plan_id: subscription.plan.id,
        },
      };
    } catch (error) {
      console.error('Error fetching active subscription plan records:', error);
      return {
        success: false,
        hasActivePlan: false,
        data: null,
      };
    }
  }
}
