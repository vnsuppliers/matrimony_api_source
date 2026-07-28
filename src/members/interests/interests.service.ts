import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestsEntity } from 'src/entities/interests.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(InterestsEntity)
    private readonly interestsRepo: Repository<InterestsEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,

    // Email service.
    private readonly emailService: EmailService,
  ) {}

  // GET MY SENT INTERESTS
  async getInterests(userId: number) {
    const interests = await this.interestsRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.to', 'u')
      .leftJoinAndMapOne(
        'u.present_address',
        'present_address',
        'pa',
        'pa.user_id = u.id',
      )
      .leftJoinAndSelect('pa.countrymaster', 'country')
      .leftJoinAndSelect('u.members', 'members')
      .leftJoinAndMapOne(
        'u.profession_info',
        'profession_info',
        'pi',
        // Changed out outer string wrappers to clean backticks for the multiline subquery
        `pi.id = (
          SELECT p.id FROM profession_info p
          WHERE p.user_id = u.id
          ORDER BY p.created_at DESC LIMIT 1
        )`,
      )
      .where('interest.interested_by = :userId', { userId })
      .andWhere('u.is_verified = 1')
      .orderBy('interest.created_at', 'DESC')
      .getMany();

    return interests.map((interest) => ({
      ...interest,
      to: {
        ...interest.to,
        profile_image: interest.to?.members?.[0]?.profile_image
          ? `/api/uploads/profile_pictures/${interest.to.members[0].profile_image}`
          : null,
      },
    }));
  }

  // SEND INTEREST
  async addInterest(userId: number, interested_to: number) {
    if (userId === interested_to) {
      throw new BadRequestException('Cannot send interest to yourself');
    }

    const exists = await this.interestsRepo.findOne({
      where: {
        interested_by: userId,
        interested_to,
      },
    });

    if (exists) {
      throw new ConflictException('Interest already sent');
    }

    const interest = this.interestsRepo.create({
      interested_by: userId,
      interested_to,
      status: 0,
    });

    await this.notificationRepo.save({
      user: { id: interested_to },
      sender: { id: userId },
      title: 'New Interest Received',
      description: 'Someone showed interest in your profile.',
      type: 'interest',
      is_read: false,
    });

    await this.interestsRepo.save(interest);

    // Get receiver email and sender details first.
    const interestData = await this.interestsRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.to', 'receiver')
      .leftJoinAndSelect('interest.by', 'sender')
      .leftJoinAndSelect('sender.members', 'sender_member')
      .where('interest.id= :id', { id: interest.id })
      .getOne();

    // Send email notification.
    if (interestData?.to?.email) {
      await this.emailService.send(
        'interest_notification',
        interestData.to.email,
        {
          receiver_name: `${interestData.to.first_name} ${interestData.to.last_name}`,

          sender_name: `${interestData.by.first_name} ${interestData.by.last_name}`,

          sender_id: interestData.by.members?.[0]?.member_id,
        },
      );
    }

    return {
      success: true,
      message: 'Interest sent successfully',
    };
  }

  // REMOVE INTEREST
  async removeInterest(userId: number, interested_to: number) {
    const result = await this.interestsRepo.delete({
      interested_by: userId,
      interested_to,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Interest does not exist');
    }

    return {
      success: true,
      message: 'Interest removed successfully',
    };
  }

  // RECEIVED INTERESTS
  async getReceivedInterests(userId: number) {
    const interests = await this.interestsRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.by', 'u')
      .leftJoinAndMapOne(
        'u.present_address',
        'present_address',
        'pa',
        'pa.user_id = u.id',
      )
      .leftJoinAndSelect('pa.countrymaster', 'country')
      .leftJoinAndSelect('u.members', 'members')
      .leftJoinAndMapOne(
        'u.profession_info',
        'profession_info',
        'pi',
        // Changed out outer string wrappers to clean backticks for the multiline subquery
        `pi.id = (
          SELECT p.id FROM profession_info p
          WHERE p.user_id = u.id
          ORDER BY p.created_at DESC LIMIT 1
        )`,
      )
      .where('interest.interested_to = :userId', { userId })
      .andWhere('u.is_verified = 1')
      .orderBy('interest.created_at', 'DESC')
      .getMany();

    return interests.map((interest) => ({
      ...interest,
      by: {
        ...interest.by,
        profile_image: interest.by?.members?.[0]?.profile_image
          ? `/api/uploads/profile_pictures/${interest.by.members[0].profile_image}`
          : null,
      },
    }));
  }

  // ACCEPT
  async acceptInterest(userId: number, interestId: number) {
    const interest = await this.interestsRepo.findOne({
      where: { id: interestId },
    });

    if (!interest) {
      throw new NotFoundException('Interest not found');
    }

    if (interest.interested_to !== userId) {
      throw new BadRequestException('Not allowed');
    }

    interest.status = 1;
    interest.rejected_by = null;

    await this.interestsRepo.save(interest);

    // Get interest details
    const acceptData = await this.interestsRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.by', 'sender')
      .leftJoinAndSelect('sender.members', 'sender_member')
      .leftJoinAndSelect('interest.to', 'receiver')
      .leftJoinAndSelect('receiver.members', 'receiver_member')
      .where('interest.id = :id', { id: interest.id })
    .getOne();

    // console.log(acceptData);

    // Send email notification accepted or declined.
    try {
      if (acceptData?.by?.email) {
        await this.emailService.send(
          'interest_status_notification',
          acceptData.by.email,
          {
            receiver_name: `${acceptData.to.first_name} ${acceptData.to.last_name}`,
            receiver_id: acceptData.to.members?.[0]?.member_id,
            sender_name: `${acceptData.by.first_name} ${acceptData.by.last_name}`,
            status: 'Accepted',
            reason: interest.reason ?? '',
          },
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      message: 'Interest accepted',
    };
  }

  // REJECT
  async rejectInterest(
    userId: number,
    interestId: number,
    reason?: string,
  ) {
    const interest = await this.interestsRepo.findOne({
      where: { id: interestId },
    });

    if (!interest) {
      throw new NotFoundException('Interest not found');
    }

    if (interest.interested_to !== userId) {
      throw new BadRequestException('Not allowed');
    }

    interest.reason = reason || null;
    interest.status = 2;
    interest.rejected_by = userId;

    await this.interestsRepo.save(interest);

    // Get interest details
    const rejectData = await this.interestsRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.by', 'sender')
      .leftJoinAndSelect('sender.members', 'sender_member')
      .leftJoinAndSelect('interest.to', 'receiver')
      .leftJoinAndSelect('receiver.members', 'receiver_member')
      .where('interest.id = :id', { id: interest.id })
      .getOne();

    // Send email notification
    if (rejectData?.by?.email) {
      await this.emailService.send(
        'interest_status_notification',
        rejectData.by.email,
        {
          receiver_name: `${rejectData.to.first_name} ${rejectData.to.last_name}`,
          receiver_id: rejectData.to.members?.[0]?.member_id,
          sender_name: `${rejectData.by.first_name} ${rejectData.by.last_name}`,
          status: 'Declined',
          reason: interest.reason ?? '',
        },
      );
    }

    return {
      success: true,
      message: 'Interest rejected',
    };
  }

  // Get rejeced interest.
  async getRejectedInterests(userId: number, type: 'me' | 'other' | 'all') {
    const qb = this.interestsRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.by', 'u')
      .where('interest.status = 2');

    if (type === 'me') {
      qb.andWhere('interest.rejected_by = :userId', { userId });
    }

    if (type === 'other') {
      qb.andWhere(
        'interest.rejected_by IS NOT NULL AND interest.rejected_by != :userId',
        { userId },
      );
    }

    if (type === 'all') {
      qb.andWhere(
        '(interest.interested_by = :userId OR interest.interested_to = :userId)',
        { userId },
      );
    }

    return qb.orderBy('interest.created_at', 'DESC').getMany();
  }

  // Get accepted interest.
  async getAcceptedInterests(userId: number, type: 'me' | 'other' | 'all') {
    const qb = this.interestsRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.by', 'u')
      .where('interest.status = 1');

    if (type === 'me') {
      qb.andWhere('interest.interested_to = :userId', { userId });
    }

    if (type === 'other') {
      qb.andWhere('interest.interested_by = :userId', { userId });
    }

    if (type === 'all') {
      qb.andWhere(
        '(interest.interested_by = :userId OR interest.interested_to = :userId)',
        { userId },
      );
    }

    return qb.orderBy('interest.created_at', 'DESC').getMany();
  }
}
