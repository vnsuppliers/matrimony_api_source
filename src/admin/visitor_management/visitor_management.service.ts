import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from 'src/entities/member.entity';
import { ProfileVisitEntity } from 'src/entities/profile_visttors.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

interface VisitedProfileGroupRecord {
  profileId: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  totalVisitorsCount: number;
}

// interface TargetVisitorRecord {
//   id: number;
//   created_at: Date;
//   visitor: {
//     id: number;
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone: string;
//     profile_image: string | null;
//   } | null;
// }

@Injectable()
export class VisitorManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
    @InjectRepository(ProfileVisitEntity)
    private readonly visitorRepo: Repository<ProfileVisitEntity>,
  ) {}

  /**
   *  Fetch paginated distinct profiles that have been visited (Includes Profile Images)
   */
  public async get_all_visited_profiles(
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    // Aggregate unique profile IDs from the table
    const queryBuilder = this.visitorRepo
      .createQueryBuilder('visit')
      .leftJoin(User, 'targetUser', 'targetUser.id = visit.profile_id')
      .select('visit.profile_id', 'profileId')
      .groupBy('visit.profile_id');

    if (search && search.trim() !== '') {
      queryBuilder.where(
        'targetUser.first_name LIKE :search OR targetUser.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const rawGroupedResults = await queryBuilder.getRawMany<{
      profileId: number;
    }>();
    const totalItems = rawGroupedResults.length;

    const paginatedProfileIds = rawGroupedResults
      .slice(skip, skip + limit)
      .map((row) => row.profileId);

    if (paginatedProfileIds.length === 0) {
      return {
        record: [] as VisitedProfileGroupRecord[],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 1,
          currentPage: page,
        },
      };
    }

    // Query rich User entity models along with their attached member rows for profile images
    const profiles = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.members', 'member')
      .where('user.id IN (:...ids)', { ids: paginatedProfileIds })
      .getMany();

    const formattedRecords: VisitedProfileGroupRecord[] = [];

    for (const user of profiles) {
      const totalVisitorsCount = await this.visitorRepo.count({
        where: { profile_id: user.id },
      });

      formattedRecords.push({
        profileId: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        profile_image: user.members?.[0]?.profile_image
          ? `/api/uploads/profile_pictures/${user.members[0].profile_image}`
          : null,
        totalVisitorsCount,
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
   * Fetch specific guest profiles who visited target profile ID
   *
   */
  public async get_profile_visitors_list(
    profileId: number,
    page: number = 1,
    rawLimit: number = 10,
    search: string = '',
  ) {
    const limit = Number(rawLimit) || 10;
    const skip = (page - 1) * limit;

    // Get paginated unique viewers for this profile
    const uniqueViewersQuery = this.visitorRepo
      .createQueryBuilder('visit')
      .leftJoin('visit.viewer', 'visitor')
      .select('visit.viewer_id', 'viewerId')
      .addSelect('COUNT(visit.id)', 'visitCount')
      .addSelect('MAX(visit.created_at)', 'latestVisit')
      .where('visit.profile_id = :profileId', { profileId })
      .groupBy('visit.viewer_id');

    if (search && search.trim() !== '') {
      uniqueViewersQuery.andWhere(
        'visitor.first_name LIKE :search OR visitor.last_name LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    // Get total items for metadata pagination tracking before slicing limits
    const rawGroupedCount = await uniqueViewersQuery.getRawMany();
    const totalItems = rawGroupedCount.length;

    // Order by the raw function expression instead of the alias string to avoid Postgres lower-case parsing crashes
    const paginatedRawResults = await uniqueViewersQuery
      .orderBy('MAX(visit.created_at)', 'DESC')
      .skip(skip)
      .take(limit)
      .getRawMany<{
        viewerId: number;
        visitCount: string;
        latestVisit: Date;
      }>();

    const formattedRecords = [];

    // Hydrate full rich profile images and user structural fields
    for (const row of paginatedRawResults) {
      const visitorUser = await this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.members', 'member')
        .where('user.id = :id', { id: row.viewerId })
        .getOne();

      formattedRecords.push({
        id: row.viewerId,
        visitCount: Number(row.visitCount),
        created_at: row.latestVisit,
        visitor: visitorUser
          ? {
              id: visitorUser.id,
              first_name: visitorUser.first_name,
              last_name: visitorUser.last_name,
              email: visitorUser.email,
              phone: visitorUser.phone,
              profile_image: visitorUser.members?.[0]?.profile_image
                ? `/api/uploads/profile_pictures/${visitorUser.members[0].profile_image}`
                : null,
            }
          : null,
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
}
