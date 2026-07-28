import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortlistEntity } from '../../entities/shortlist.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ShortlistService {
  constructor(
    @InjectRepository(ShortlistEntity)
    private readonly shortlistRepo: Repository<ShortlistEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,

    // Send email.
    private readonly emailService: EmailService
  ) {}

  // ADD TO SHORTLIST
  async add(userId: number, shortlisted_to: number) {
    if (userId === shortlisted_to) {
      throw new BadRequestException('Cannot shortlist yourself');
    }

    const exists = await this.shortlistRepo.findOne({
      where: { shortlisted_by: userId, shortlisted_to },
    });

    if (exists) {
      throw new ConflictException('Already shortlisted');
    }

    const row = this.shortlistRepo.create({
      shortlisted_by: userId,
      shortlisted_to,
    });
    await this.shortlistRepo.save(row);

    await this.notificationRepo.save({
      user: { id: shortlisted_to }, // Recipient
      sender: { id: userId }, // Triggering Actor
      title: 'New Shortlist',
      description: 'Someone added you to their shortlist.',
      type: 'shortlist',
      is_read: false,
    });

    const addData = await this.shortlistRepo
      .createQueryBuilder('shortlist')
      .leftJoinAndSelect(
        'shortlist.shortlisted_to_user',
        'receiver',
      )
      .leftJoinAndSelect(
        'shortlist.shortlisted_by_user',
        'sender',
      )
      .leftJoinAndSelect(
        'sender.members',
        'sender_member',
      )
      .leftJoinAndSelect(
        'receiver.members',
        'receiver_member',
      )
      .where('shortlist.id = :id', { id: row.id })
      .getOne();

    if (addData?.shortlisted_to_user?.email) {
      await this.emailService.send(
        'shortlist_notification',
        addData.shortlisted_to_user.email,
        {
          receiver_name: `${addData.shortlisted_to_user.first_name} ${addData.shortlisted_to_user.last_name}`,

          sender_name: `${addData.shortlisted_by_user.first_name} ${addData.shortlisted_by_user.last_name}`,

          sender_id:
            addData.shortlisted_by_user.members?.[0]?.member_id,
        },
      );
    }

     

    return {
      success: true,
      message: 'Added to shortlist',
    };
  }

  // REMOVE FROM SHORTLIST
  async remove(userId: number, shortlisted_to: number) {
    const result = await this.shortlistRepo.delete({
      shortlisted_by: userId,
      shortlisted_to,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Not found in shortlist');
    }

    return {
      success: true,
      message: 'Removed from shortlist',
    };
  }

  // GET MY SHORTLIST
  async getMyShortlist(userId: number) {
    return this.shortlistRepo.find({
      where: {
        shortlisted_by: userId,
        shortlisted_to_user: { is_verified: 1 }, // 🔥 FIXED: Only return target profiles that are fully active
      },
      relations: [
        'shortlisted_to_user',
        'shortlisted_to_user.permanent_address',
        'shortlisted_to_user.permanent_address.countrymaster',
        'shortlisted_to_user.permanent_address.statemaster',
        'shortlisted_to_user.permanent_address.citymaster',
        'shortlisted_to_user.education_info',
        'shortlisted_to_user.education_info.edumaster',
        'shortlisted_to_user.education_info.countryMaster',
        'shortlisted_to_user.education_info.statemaster',
        'shortlisted_to_user.education_info.citymaster',
        'shortlisted_to_user.education_info.specialmaster',
        'shortlisted_to_user.professionInfos',
        'shortlisted_to_user.professionInfos.profession',
        'shortlisted_to_user.professionInfos.designation',
      ],
      order: { created_at: 'DESC' },
    });
  }

  // CHECK SINGLE STATUS
  async check(userId: number, shortlisted_to: number) {
    const exists = await this.shortlistRepo.findOne({
      where: { shortlisted_by: userId, shortlisted_to },
    });

    return {
      isShortlisted: !!exists,
    };
  }
}
