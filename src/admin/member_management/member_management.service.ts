import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AccountStatus } from 'src/user/enums/user-status.enum';
import { MemberManageActionDto } from './types/member_management.types';


@Injectable()
export class MemberManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  public async handle_member_action(
    userId: number,
    dto: MemberManageActionDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['members'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID #${userId} was not found.`);
    }

    if (
      ['block', 'suspend', 'deactivate', 'delete'].includes(dto.action) &&
      !dto.reason?.trim()
    ) {
      throw new BadRequestException(
        `Please provide a reason for this action (${dto.action}).`,
      );
    }

    switch (dto.action) {
      case 'approve':
        return this.approve_member(user);
      case 'block':
        return this.block_member(user, dto.reason);
      case 'unblock':
        return this.unblock_member(user);
      case 'suspend':
        return this.suspend_member(user, dto.reason);
      case 'unsuspend':
        return this.unsuspend_member(user);
      case 'deactivate':
        return this.deactivate_member(user, dto.reason);
      case 'activate':
        return this.activate_member(user);
      case 'delete':
        return this.purge_member_record(user, dto.reason);
      default:
        throw new BadRequestException('Invalid action requested.');
    }
  }

  private async approve_member(user: User) {
    user.is_verified = 1;
    user.account_status = AccountStatus.ACTIVE;
    user.account_status_message =
      'Your profile has been approved and activated.';
    const saved = await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Profile Approved',
      'Your member profile has been verified and activated.',
    );
    return {
      success: true,
      message: 'Member approved successfully.',
      profile: saved,
    };
  }

  private async block_member(user: User, reason: string) {
    user.account_status = AccountStatus.BLOCKED;
    user.account_status_message = `Your account was blocked. Reason: ${reason}`;

    const saved = await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Account Blocked',
      `Your account has been blocked due to: ${reason}`,
    );
    return {
      success: true,
      message: 'Member blocked successfully.',
      profile: saved,
    };
  }

  private async unblock_member(user: User) {
    user.account_status = AccountStatus.ACTIVE;
    user.account_status_message = 'Your account has been unblocked.';

    const saved = await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Account Unblocked',
      'Your account block has been removed.',
    );
    return {
      success: true,
      message: 'Member unblocked successfully.',
      profile: saved,
    };
  }

  private async suspend_member(user: User, reason: string) {
    user.is_verified = 2;
    user.account_status = AccountStatus.SUSPENDED;
    user.account_status_message = `Your account was suspended. Reason: ${reason}`;

    const saved = await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Account Suspended',
      `Your access has been temporarily suspended. Reason: ${reason}`,
    );
    return {
      success: true,
      message: 'Member suspended successfully.',
      profile: saved,
    };
  }

  private async unsuspend_member(user: User) {
    user.is_verified = 1;
    user.account_status = AccountStatus.ACTIVE;
    user.account_status_message = 'Your suspension has been lifted.';

    const saved = await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Suspension Lifted',
      'Your account suspension has been lifted.',
    );
    return {
      success: true,
      message: 'Member suspension lifted successfully.',
      profile: saved,
    };
  }

  private async activate_member(user: User) {
    user.is_verified = 1;
    user.account_status = AccountStatus.ACTIVE;
    user.account_status_message = 'Your account is now active.';

    const saved = await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Account Activated',
      'Your account has been activated.',
    );
    return {
      success: true,
      message: 'Member activated successfully.',
      profile: saved,
    };
  }

  private async deactivate_member(user: User, reason: string) {
    user.is_verified = 3;
    user.account_status = AccountStatus.DEACTIVATED;
    user.account_status_message = `Your account was deactivated. Reason: ${reason}`;
    const saved = await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Account Deactivated',
      `Your account has been deactivated. Reason: ${reason}`,
    );
    return {
      success: true,
      message: 'Member deactivated successfully.',
      profile: saved,
    };
  }

  private async purge_member_record(user: User, reason: string) {
    user.is_verified = 4;
    user.account_status = AccountStatus.DELETED;
    user.account_status_message = `Your account was deleted. Reason: ${reason}`;
    await this.userRepo.save(user);

    this.log_notification(
      user.id,
      'Account Deleted',
      `Your account has been deleted. Reason: ${reason}`,
    );

    await this.userRepo.softDelete(user.id);
    return {
      success: true,
      message: 'Member account deleted successfully.',
    };
  }

  private log_notification(userId: number, title: string, body: string): void {
    try {
      console.log(
        `[MEMBER OPERATIONS AUDIT] User #${userId} | ${title} -> ${body}`,
      );
    } catch (err) {
      console.error('Failed to log audit notification record.', err);
    }
  }
}
