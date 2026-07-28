import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from 'src/entities/member.entity';
import { RatingEntity } from 'src/entities/ratings.entity';
import { SuccessStoryEntity } from 'src/entities/success_story.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
    @InjectRepository(SuccessStoryEntity)
    private readonly successStoryRepo: Repository<SuccessStoryEntity>,
    @InjectRepository(RatingEntity)
    private readonly ratingRepo: Repository<RatingEntity>,
  ) {}

  public async getProfileImage(userId: number) {
    const member = await this.memberRepo.findOne({
      where: { user_id: userId },
      select: ['profile_image'],
    });

    if (!member) {
      throw new NotFoundException('Profile not exists');
    }

    return {
      profile_image: member.profile_image,
    };
  }

  /**
   * get global success stories & ratings.
   */
  async get_active_success_story_ratings() {
    const items = await this.successStoryRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .select([
        's.id',
        's.user_id',
        's.groom_name',
        's.bride_name',
        's.image',
        's.description',
        's.location',
        's.marriage_date',
        's.status',
      ])
      .where('s.status = :status', { status: 1 })
      .orderBy('s.id', 'DESC')
      .take(5)
      .getMany();

    const userIds = items.map((story) => story.user_id);

    const ratings = userIds.length
      ? await this.ratingRepo
          .createQueryBuilder('r')
          .where('r.user_id IN (:...userIds)', { userIds })
          .andWhere('r.status = :status', { status: 1 })
          .getMany()
      : [];

    const ratingsMap = new Map(
      ratings.map((rating) => [rating.user_id, rating]),
    );

    const finalItems = items.map((story) => {
      const rating = ratingsMap.get(story.user_id);

      return {
        groom_name: story.groom_name,
        bride_name: story.bride_name,
        marriage_date: story.marriage_date,
        location: story.location,
        description: story.description,
        image: story.image
          ? `/api/uploads/success_stories/${story.image}`
          : null,
        status: story.status ?? 1,
        rating: rating
          ? {
              rating: rating.rating,
              status: rating.status ?? 1,
            }
          : null,
      };
    });

    return {
      status: true,
      data: {
        items: finalItems,
      },
    };
  }
}
