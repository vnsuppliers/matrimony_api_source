import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockProfileDto } from 'src/dto/block_profile.dto';
import { BlockProfileEntity } from 'src/entities/block_profile.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity'; // Imported User entity
import { Repository } from 'typeorm';

@Injectable()
export class BlockProfileService {
  constructor(
    @InjectRepository(BlockProfileEntity)
    private readonly blockRepo: Repository<BlockProfileEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // Injected User Repository
  ) {}

  async get_blocked_list(userId: number) {
    // 1. Validate the live state of the requesting user
    const caller = await this.userRepo.findOne({ where: { id: userId } });
    if (!caller) throw new NotFoundException('User not found');
    if (caller.is_verified !== 1) {
      throw new ForbiddenException(
        caller.account_status_message || 'Access Denied.',
      );
    }

    // Fetch blocked users, ensuring the blocked target profile is active/verified
    return this.blockRepo.find({
      where: {
        blocker_user_id: userId,
        is_active: true,
        blockedUser: { is_verified: 1 }, // Ensure target profile is active
      },
      relations: ['blockedUser'],
    });
  }

  async block(
    blocker_user_id: number,
    blocked_user_id: number,
    dto: BlockProfileDto,
  ) {
    // Verify the dynamic status of the blocker action trigger
    const blocker = await this.userRepo.findOne({
      where: { id: blocker_user_id },
    });
    if (!blocker) throw new NotFoundException('Blocker user account not found');
    if (blocker.is_verified !== 1) {
      throw new ForbiddenException(
        blocker.account_status_message || 'Access Denied.',
      );
    }

    if (blocker_user_id === blocked_user_id) {
      throw new BadRequestException('Cannot block yourself');
    }

    // Look up existing block interactions
    const exists = await this.blockRepo.findOne({
      where: {
        blocker_user_id,
        blocked_user_id,
        is_active: true,
      },
    });

    if (exists) {
      throw new ConflictException('User already blocked');
    }

    // Create block entry mapping
    const block = this.blockRepo.create({
      blocker_user_id,
      blocked_user_id,
      reason: dto.reason,
      reason_type: dto.reason_type,
      is_active: true,
    });

    await this.blockRepo.save(block);

    // Save notification log payload
    await this.notificationRepo.save({
      user: { id: blocked_user_id },
      sender: { id: blocker_user_id },
      title: 'Profile Blocked',
      description: 'Your profile has been blocked by another user.',
      type: 'block',
      is_read: false,
    });

    return {
      success: true,
      message: 'User blocked successfully',
    };
  }

  async unblock(blocker_user_id: number, blocked_user_id: number) {
    // Guard check actor parameter states
    const blocker = await this.userRepo.findOne({
      where: { id: blocker_user_id },
    });
    if (!blocker)
      throw new NotFoundException(
        'Blocker account registration record missing',
      );
    if (blocker.is_verified !== 1) {
      throw new ForbiddenException(
        blocker.account_status_message || 'Access Denied.',
      );
    }

    // Perform safe unblock data operations
    const result = await this.blockRepo.delete({
      blocker_user_id,
      blocked_user_id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('User not found in blocked list');
    }

    return {
      success: true,
      message: 'User unblocked successfully',
    };
  }
}
