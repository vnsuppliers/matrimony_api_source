import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportProfilesEntity } from 'src/entities/report_profile.entity';
import { ReportProfileDto } from '../../dto/report_profile.dto';
import { NotificationEntity } from 'src/entities/notification.entity';

@Injectable()
export class ReportProfilesService {
  constructor(
    @InjectRepository(ReportProfilesEntity)
    private readonly reportRepo: Repository<ReportProfilesEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  async createReport(reporterId: number, dto: ReportProfileDto) {
    const { reported_user_id, reason, description } = dto;

    if (reporterId === reported_user_id) {
      throw new BadRequestException('You cannot report yourself');
    }

    const exists = await this.reportRepo.findOne({
      where: {
        reporter: { id: reporterId },
        reportedUser: { id: reported_user_id },
      },
    });

    if (exists) {
      throw new ConflictException('You already reported this user');
    }

    const report = this.reportRepo.create({
      reporter: { id: reporterId },
      reportedUser: { id: reported_user_id },
      reason,
      description,
      status: 'pending',
    });

    await this.reportRepo.save(report);

    await this.notificationRepo.save({
      user: { id: reported_user_id }, // Recipient (The reported user)
      sender: { id: reporterId }, // Sender (The person reporting)
      title: 'Profile Reported',
      description: 'Your profile has been reported by another user.',
      type: 'report',
      is_read: false,
    });

    return {
      success: true,
      message: 'Report submitted successfully',
    };
  }

  async getAllReports() {
    return this.reportRepo.find({
      relations: ['reporter', 'reportedUser'],
      order: { created_at: 'DESC' },
    });
  }

  async checkIfReported(reporterId: number, reportedUserId: number) {
    const exists = await this.reportRepo.findOne({
      where: {
        reporter: { id: reporterId },
        reportedUser: { id: reportedUserId },
      },
    });

    return {
      isReported: !!exists,
    };
  }

  async getSubmittedReports(reporterId: number) {
    return this.reportRepo.find({
      where: { reporter: { id: reporterId } },
      relations: ['reportedUser'],
      order: { created_at: 'DESC' },
    });
  }

  async getReceivedReports(userId: number) {
    return this.reportRepo.find({
      where: {
        reportedUser: { id: userId },
      },
      relations: ['reporter'],
      order: { created_at: 'DESC' },
    });
  }
}
