import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockProfileDto } from 'src/dto/block_profile.dto';
import { EmailService } from 'src/email/email.service';
import { BlockProfileEntity } from 'src/entities/block_profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

interface BlockerGroupRecord {
  blockerId: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  totalBlockedCount: number;
}

interface TargetBlockedRecord {
  id: number;
  reason: string | null;
  reason_type:
    | 'harassment'
    | 'fake_profile'
    | 'not_interested'
    | 'other'
    | null;
  is_active: boolean;
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
export class BlockManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(BlockProfileEntity)
    private readonly blockRepo: Repository<BlockProfileEntity>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Fetch paginated distinct users who have blocked profiles
   */
  public async get_all_blocks(
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    // Swapped raw string 'user' with the clean injected User class entity token definition metadata reference
    const queryBuilder = this.blockRepo
      .createQueryBuilder('block')
      .leftJoin(User, 'blocker', 'blocker.id = block.blocker_user_id')
      .select('block.blocker_user_id', 'blockerId')
      .groupBy('block.blocker_user_id');

    if (search && search.trim() !== '') {
      queryBuilder.where(
        'blocker.first_name LIKE :search OR blocker.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const rawGroupedResults = await queryBuilder.getRawMany<{
      blockerId: number;
    }>();
    const totalItems = rawGroupedResults.length;

    const paginatedBlockerIds = rawGroupedResults
      .slice(skip, skip + limit)
      .map((row) => row.blockerId);

    if (paginatedBlockerIds.length === 0) {
      return {
        record: [] as BlockerGroupRecord[],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 1,
          currentPage: page,
        },
      };
    }

    const blockers = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.members', 'member')
      .where('user.id IN (:...ids)', { ids: paginatedBlockerIds })
      .getMany();

    const formattedRecords: BlockerGroupRecord[] = [];

    for (const user of blockers) {
      const totalBlockedCount = await this.blockRepo.count({
        where: { blocker_user_id: user.id },
      });

      formattedRecords.push({
        blockerId: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        profile_image: user.members?.[0]?.profile_image
          ? `/api/uploads/profile_pictures/${user.members[0].profile_image}`
          : null,
        totalBlockedCount,
      });
    }

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
   * Fetch specific profiles blocked by a unique blocker user ID
   */
  public async get_blocker_targets(
    blockerId: number,
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    const query = this.blockRepo
      .createQueryBuilder('block')
      .leftJoinAndSelect('block.blockedUser', 'receiver')
      .leftJoinAndSelect('receiver.members', 'receiverMember')
      .where('block.blocker_user_id = :blockerId', { blockerId });

    if (search && search.trim() !== '') {
      query.andWhere(
        'receiver.first_name LIKE :search OR receiver.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const [interactions, totalItems] = await query
      .orderBy('block.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedRecords: TargetBlockedRecord[] = interactions.map(
      (item) => ({
        id: item.id,
        reason: item.reason || null,
        reason_type: item.reason_type || null,
        is_active: item.is_active,
        created_at: item.created_at,
        recipient: item.blockedUser
          ? {
              id: item.blockedUser.id,
              first_name: item.blockedUser.first_name,
              last_name: item.blockedUser.last_name,
              email: item.blockedUser.email,
              phone: item.blockedUser.phone,
              profile_image: item.blockedUser.members?.[0]?.profile_image
                ? `/api/uploads/profile_pictures/${item.blockedUser.members[0].profile_image}`
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
   *  Administratively lift a block connection (Deactivates restriction)
   */
  public async lift_block(id: number) {
    const block = await this.blockRepo.findOne({ where: { id } });
    if (!block) {
      throw new NotFoundException(
        `Block link profile instance entry #${id} not located.`,
      );
    }
    block.is_active = false;
    await this.blockRepo.save(block);
    return { success: true, message: 'Profile unblocked systematically.' };
  }

  /**
   *  Permanently scrub a block data row out of SQL entirely
   */
  public async delete_block_log(id: number) {
    const block = await this.blockRepo.findOne({ where: { id } });
    if (!block) {
      throw new NotFoundException(`Block row ledger record #${id} not found.`);
    }
    await this.blockRepo.remove(block);
    return {
      success: true,
      message: 'Block ledger log entry completely removed.',
    };
  }
}
