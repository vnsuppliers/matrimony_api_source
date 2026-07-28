import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortlistEntity } from 'src/entities/shortlist.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

interface ShortlistGroupRecord {
  senderId: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  totalShortlistedCount: number;
}

interface TargetShortlistRecord {
  id: number;
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
export class ShortlistManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ShortlistEntity)
    private readonly shortlistRepo: Repository<ShortlistEntity>,
  ) {}

  /**
   * Senders List (Paginated by UNIQUE shortlisters - 10 per page default)
   */
  public async get_all_shortlists(
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    // 1. Get the IDs of UNIQUE profiles performing the bookmarked shortlists actions
    const shortlisterIdsQuery = this.shortlistRepo
      .createQueryBuilder('shortlist')
      .leftJoin('shortlist.shortlisted_by_user', 'sender')
      .select('shortlist.shortlisted_by', 'senderId')
      .groupBy('shortlist.shortlisted_by');

    if (search && search.trim() !== '') {
      shortlisterIdsQuery.where(
        'sender.first_name LIKE :search OR sender.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const rawGroupedResults = await shortlisterIdsQuery.getRawMany<{
      senderId: number;
    }>();
    const totalItems = rawGroupedResults.length;

    const paginatedSenderIds = rawGroupedResults
      .slice(skip, skip + limit)
      .map((row) => row.senderId);

    if (paginatedSenderIds.length === 0) {
      return {
        record: [] as ShortlistGroupRecord[],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 1,
          currentPage: page,
        },
      };
    }

    // 2. Query rich entity models matching paginated indices segments
    const shortlists = await this.shortlistRepo
      .createQueryBuilder('shortlist')
      .leftJoinAndSelect('shortlist.shortlisted_by_user', 'sender')
      .leftJoinAndSelect('sender.members', 'senderMember')
      .where('shortlist.shortlisted_by IN (:...ids)', {
        ids: paginatedSenderIds,
      })
      .orderBy('shortlist.created_at', 'DESC')
      .getMany();

    const groupedMap = new Map<number, ShortlistGroupRecord>();

    for (const item of shortlists) {
      if (!item.shortlisted_by_user) continue;
      const senderId = item.shortlisted_by_user.id;

      if (!groupedMap.has(senderId)) {
        const totalSavedCount = await this.shortlistRepo.count({
          where: { shortlisted_by: senderId },
        });

        groupedMap.set(senderId, {
          senderId,
          first_name: item.shortlisted_by_user.first_name,
          last_name: item.shortlisted_by_user.last_name,
          email: item.shortlisted_by_user.email,
          phone: item.shortlisted_by_user.phone,
          profile_image: item.shortlisted_by_user.members?.[0]?.profile_image
            ? `/api/uploads/profile_pictures/${item.shortlisted_by_user.members[0].profile_image}`
            : null,
          totalShortlistedCount: totalSavedCount,
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

  /**
   * Target Recipients Sub Directory (Paginated - 10 per page default)
   */
  public async get_sender_shortlists(
    senderId: number,
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    const query = this.shortlistRepo
      .createQueryBuilder('shortlist')
      .leftJoinAndSelect('shortlist.shortlisted_to_user', 'receiver')
      .leftJoinAndSelect('receiver.members', 'receiverMember')
      .where('shortlist.shortlisted_by = :senderId', { senderId });

    if (search && search.trim() !== '') {
      query.andWhere(
        'receiver.first_name LIKE :search OR receiver.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const [interactions, totalItems] = await query
      .orderBy('shortlist.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedRecords: TargetShortlistRecord[] = interactions.map(
      (item) => ({
        id: item.id,
        created_at: item.created_at,
        recipient: item.shortlisted_to_user
          ? {
              id: item.shortlisted_to_user.id,
              first_name: item.shortlisted_to_user.first_name,
              last_name: item.shortlisted_to_user.last_name,
              email: item.shortlisted_to_user.email,
              phone: item.shortlisted_to_user.phone,
              profile_image: item.shortlisted_to_user.members?.[0]
                ?.profile_image
                ? `/api/uploads/profile_pictures/${item.shortlisted_to_user.members[0].profile_image}`
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
   * Action: Permanently drops a shortlist linkage row instance by tracking ID.
   */
  public async delete_shortlist(id: number) {
    const shortlist = await this.shortlistRepo.findOne({ where: { id } });
    if (!shortlist) {
      throw new NotFoundException(
        `Shortlist reference row tracking entry #${id} not found.`,
      );
    }
    await this.shortlistRepo.remove(shortlist);
    return {
      success: true,
      message: 'Shortlist connection item dropped successfully.',
    };
  }
}
