import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRatingDto } from 'src/dto/create-rating.dto';
import { CreateSuccessStoryDto } from 'src/dto/create-success-story.dto';
import { RatingEntity } from 'src/entities/ratings.entity';
import { SuccessStoryEntity } from 'src/entities/success_story.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SuccessStoryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(SuccessStoryEntity)
    private readonly successStoryRepo: Repository<SuccessStoryEntity>,

    @InjectRepository(RatingEntity)
    private readonly ratingsRepo: Repository<RatingEntity>,
  ) {}

  public async get_success_story(user_id: number) {
    const successStory = await this.successStoryRepo.findOne({
      where: { user_id },
    });

    const rating = await this.ratingsRepo.findOne({
      where: { user_id },
    });

    // Format image path exactly like BasicInfoService does
    if (successStory && successStory.image) {
      successStory.image = `/api/uploads/success_stories/${successStory.image}`;
    }

    return {
      status: true,
      message: 'Success story fetched successfully',
      data: {
        success_story: successStory || null,
        rating: rating || null,
      },
    };
  }

  public async update_create_success_story(
    user_id: number,
    successPayload: CreateSuccessStoryDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let successStory = await this.successStoryRepo.findOne({
      where: { user_id },
    });

    let savedRating = await this.ratingsRepo.findOne({
      where: { user_id },
    });

    // ================= UPDATE =================
    if (successStory) {
      // Remove old image if new image uploaded
      if (
        successPayload.image &&
        successStory.image &&
        successPayload.image !== successStory.image
      ) {
        const imagePath = path.join(
          process.cwd(),
          'uploads',
          'success_stories',
          successStory.image,
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      successStory.groom_name = successPayload.groom_name;
      successStory.bride_name = successPayload.bride_name;
      successStory.description = successPayload.description;
      successStory.marriage_date = new Date(successPayload.marriage_date);
      successStory.location = successPayload.location;

      if (successPayload.image) {
        successStory.image = successPayload.image;
      }

      // Resubmitted → Pending Review again
      successStory.status = 0;
      successStory.decline_reason = null;

      successStory = await this.successStoryRepo.save(successStory);

      if (savedRating) {
        savedRating.rating = Number(successPayload.rating);
        savedRating.status = 0;

        savedRating = await this.ratingsRepo.save(savedRating);
      } else if (successPayload.rating) {
        savedRating = await this.ratingsRepo.save({
          user_id,
          rating: Number(successPayload.rating),
          status: 0,
        });
      }

      if (successStory.image) {
        successStory.image = `/api/uploads/success_stories/${successStory.image}`;
      }

      return {
        status: true,
        message:
          'Success story updated successfully and sent for admin review.',
        data: {
          success_story: successStory,
          rating: savedRating,
        },
      };
    }

    // ================= CREATE =================
    successStory = await this.successStoryRepo.save({
      user_id,
      groom_name: successPayload.groom_name,
      bride_name: successPayload.bride_name,
      image: successPayload.image,
      description: successPayload.description,
      marriage_date: successPayload.marriage_date,
      location: successPayload.location,
      status: 0,
      decline_reason: null,
    });

    if (successPayload.rating) {
      savedRating = await this.ratingsRepo.save({
        user_id,
        rating: Number(successPayload.rating),
        status: 0,
      });
    }

    if (!successStory) {
      throw new InternalServerErrorException('Failed to save success story');
    }

    if (successStory.image) {
      successStory.image = `/api/uploads/success_stories/${successStory.image}`;
    }

    return {
      status: true,
      message:
        'Success story submitted successfully and is awaiting admin approval.',
      data: {
        success_story: successStory,
        rating: savedRating,
      },
    };
  }
}
