import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestsEntity } from 'src/entities/interests.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

interface SenderGroupRecord {
  senderId: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  totalInterestsSent: number;
}

interface RecipientFormattedRecord {
  id: number;
  status: number;
  reason: string;
  rejected_by: number | null;
  created_at: Date;
  recipient: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_image: string | null;
  } | null;
}

@Injectable()
export class InterestManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(InterestsEntity)
    private readonly interestRepo: Repository<InterestsEntity>,
  ) {}

  public async get_all_interests(
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    const senderIdsQuery = this.interestRepo
      .createQueryBuilder('interest')
      .leftJoin('interest.by', 'sender')
      .select('interest.interested_by', 'senderId')
      .groupBy('interest.interested_by');

    if (search && search.trim() !== '') {
      senderIdsQuery.where(
        'sender.first_name LIKE :search OR sender.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const rawGroupedResults = await senderIdsQuery.getRawMany<{
      senderId: number;
    }>();
    const totalItems = rawGroupedResults.length;

    const paginatedSenderIds = rawGroupedResults
      .slice(skip, skip + limit)
      .map((row) => row.senderId);

    if (paginatedSenderIds.length === 0) {
      return {
        record: [] as SenderGroupRecord[],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 1,
          currentPage: page,
        },
      };
    }

    const interests = await this.interestRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.by', 'sender')
      .leftJoinAndSelect('sender.members', 'senderMember')
      .where('interest.interested_by IN (:...ids)', { ids: paginatedSenderIds })
      .orderBy('interest.created_at', 'DESC')
      .getMany();

    const groupedMap = new Map<number, SenderGroupRecord>();

    for (const item of interests) {
      if (!item.by) continue;
      const senderId = item.by.id;

      if (!groupedMap.has(senderId)) {
        const totalSentCount = await this.interestRepo.count({
          where: { interested_by: senderId },
        });

        groupedMap.set(senderId, {
          senderId,
          first_name: item.by.first_name,
          last_name: item.by.last_name,
          email: item.by.email,
          phone: item.by.phone,
          profile_image: item.by.members?.[0]?.profile_image
            ? `/api/uploads/profile_pictures/${item.by.members[0].profile_image}`
            : null,
          totalInterestsSent: totalSentCount,
        });
      }
    }

    return {
      record: Array.from(groupedMap.values()),
      meta: {
        totalItems,
        itemCount: groupedMap.size,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit) || 1,
        currentPage: page,
      },
    };
  }

  public async get_sender_interactions(
    senderId: number,
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    const query = this.interestRepo
      .createQueryBuilder('interest')
      .leftJoinAndSelect('interest.to', 'receiver')
      .leftJoinAndSelect('receiver.members', 'receiverMember')
      .where('interest.interested_by = :senderId', { senderId });

    if (search && search.trim() !== '') {
      query.andWhere(
        'receiver.first_name LIKE :search OR receiver.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const [interactions, totalItems] = await query
      .orderBy('interest.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedRecords: RecipientFormattedRecord[] = interactions.map(
      (item) => ({
        id: item.id,
        status: item.status,
        reason: item.reason,
        rejected_by: item.rejected_by,
        created_at: item.created_at,
        recipient: item.to
          ? {
              id: item.to.id,
              first_name: item.to.first_name,
              last_name: item.to.last_name,
              email: item.to.email,
              phone: item.to.phone,
              profile_image: item.to.members?.[0]?.profile_image
                ? `/api/uploads/profile_pictures/${item.to.members[0].profile_image}`
                : null,
            }
          : null,
      }),
    );

    return {
      record: formattedRecords,
      meta: {
        totalItems,
        itemCount: formattedRecords.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit) || 1,
        currentPage: page,
      },
    };
  }

  /**
   * Administrative Rejection (Enforces status = 2, saves reasoning notes)
   */
  public async reject_interest(
    id: number,
    adminId: number,
    rejectionReason: string,
  ) {
    const interest = await this.interestRepo.findOne({ where: { id } });
    if (!interest) {
      throw new NotFoundException(
        `Interest connection row #${id} not located.`,
      );
    }

    interest.status = 2; // Hardcoded to 2 for Declined / Rejected state context
    interest.rejected_by = adminId;
    interest.reason = rejectionReason;

    await this.interestRepo.save(interest);
    return {
      success: true,
      message: 'Interest expression flagged as rejected successfully',
    };
  }

  /**
   * Administrative Remove (Purges row completely)
   */
  public async delete_interest(id: number) {
    const interest = await this.interestRepo.findOne({ where: { id } });
    if (!interest) {
      throw new NotFoundException(
        `Interest entry log with ID #${id} not found.`,
      );
    }
    await this.interestRepo.remove(interest);
    return {
      success: true,
      message: 'Expression registry entry purged from database rows',
    };
  }
}
