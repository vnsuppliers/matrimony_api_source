import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private repo: Repository<NotificationEntity>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getUserNotifications(userId: number) {
    // Check the calling user's live verification state
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.is_verified !== 1) {
      throw new ForbiddenException(
        user.account_status_message || 'Access Denied.',
      );
    }

    return this.repo.find({
      where: {
        user: { id: userId },
      },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }

  async markAllAsRead(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.is_verified !== 1) {
      throw new ForbiddenException('Action not allowed.');
    }

    return this.repo.update(
      { user: { id: userId }, is_read: false },
      { is_read: true },
    );
  }
}
