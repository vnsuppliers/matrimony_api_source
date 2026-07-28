import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from 'src/entities/ratings.entity';
import { SuccessStoryEntity } from 'src/entities/success_story.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ApproveSuccessStoryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(SuccessStoryEntity)
    private readonly successStoryRepo: Repository<SuccessStoryEntity>,

    @InjectRepository(RatingEntity)
    private readonly ratingRepo: Repository<RatingEntity>,
  ) {}

  /**
   *
   * @param userId
   * @param status
   * @param declineReason
   * @returns
   * Update / Create the success story & ratings.
   */
  async updateSuccessStoryStatus(
    userId: number,
    status: number,
    declineReason?: string,
  ) {
    const story = await this.successStoryRepo.findOne({
      where: { user_id: userId },
    });

    if (!story) {
      throw new NotFoundException('Success story not found');
    }

    const rating = await this.ratingRepo.findOne({
      where: { user_id: userId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    story.status = status;
    rating.status = status;

    if (status === 2) {
      story.decline_reason = declineReason;
    } else {
      story.decline_reason = null;
    }

    await this.successStoryRepo.save(story);
    await this.ratingRepo.save(rating);

    return {
      success: true,
      message:
        status === 1
          ? 'Success story approved successfully.'
          : 'Success story declined successfully.',
    };
  }

  /**
   *
   * @param page
   * @param limit
   * @returns
   * Get all success story & ratings list per page 10 records.
   *
   */

  async getAllAdminStories(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.successStoryRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('u.members', 'm')
      .leftJoinAndSelect(RatingEntity, 'r', 'r.user_id = s.user_id')
      .select([
        's.id',
        's.user_id',
        's.groom_name',
        's.bride_name',
        's.image',
        's.description',
        's.marriage_date',
        's.location',
        's.decline_reason',
        's.status',
        'u.id',
        'u.first_name',
        'u.last_name',
        'u.email',
        'r.rating',
        'r.status',
      ])
      .orderBy('s.id', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, totalRecords] = await queryBuilder.getManyAndCount();

    const formattedItems = items.map((story) => {
      return {
        id: story.id,
        user_id: story.user_id,
        groom_name: story.groom_name,
        bride_name: story.bride_name,
        marriage_date: story.marriage_date,
        location: story.location,
        description: story.description,
        image: story.image
          ? `/api/uploads/success_stories/${story.image}`
          : null,
        status: story.status ?? 0,
        decline_reason: story.decline_reason,
        user: story.user
          ? {
              first_name: story.user.first_name,
              last_name: story.user.last_name,
              email: story.user.email,
            }
          : null,
      };
    });

    const userIds = items.map((i) => i.user_id);
    let ratingsMap = new Map();
    if (userIds.length > 0) {
      const ratings = await this.ratingRepo
        .createQueryBuilder('rating')
        .where('rating.user_id IN (:...userIds)', { userIds })
        .getMany();
      ratingsMap = new Map(ratings.map((r) => [r.user_id, r]));
    }

    const finalItems = formattedItems.map((story) => {
      const r = ratingsMap.get(story.user_id);
      return {
        ...story,
        rating: r ? { rating: r.rating, status: r.status ?? 0 } : null,
      };
    });

    return {
      status: true,
      data: {
        items: finalItems,
        pagination: {
          totalRecords,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
          perPage: limit,
        },
      },
    };
  }

  /**
   *
   * @param memberId
   * @returns
   * Handle to delete success story & ratings
   */
  public async delete_success_story_ratings(memberId: number) {
    return await this.successStoryRepo.manager.transaction(
      async (transactionalEntityManager) => {
        // Fetch the story first to get the image path/filename before deleting it
        const story = await transactionalEntityManager
          .createQueryBuilder()
          .select('s')
          .from('success_stories', 's')
          .where('s.user_id = :memberId', { memberId })
          .getOne();

        if (story && story.image) {
          // Assuming story.image stores something like "upload/success_stories/filename.jpg" or just the filename.
          // Adjust the path resolution based on how your image path is stored in the database.
          const imagePath = path.join(process.cwd(), story.image);

          // Check if file exists and delete it
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }

        // Delete from the ratings table
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from('ratings')
          .where('user_id = :memberId', { memberId })
          .execute();

        // Delete from the success story table
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from('success_stories')
          .where('user_id = :memberId', { memberId })
          .execute();
      },
    );
  }
}
