import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateHobbiesInfoDto } from 'src/dto/create_update_hobbies_info.dto';
import { HobbiesInfoEntity } from 'src/entities/hobbies_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HobbiesManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(HobbiesInfoEntity)
    private readonly hobbiesManagementRepo: Repository<HobbiesInfoEntity>,
  ) {}

  public async update_create(
    targetUserId: number,
    payload: CreateUpdateHobbiesInfoDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException(`User not found with ID: ${targetUserId}`);
    }

    const updateCreateData = {
      hobbies: payload.hobbies?.trim() || null,
      interests: payload.interests?.trim() || null,
      favorite_music: payload.favorite_music?.trim() || null,
      favorite_movies: payload.favorite_movies?.trim() || null,
      favorite_books: payload.favorite_books?.trim() || null,
      sports: payload.sports?.trim() || null,
      activities: payload.activities?.trim() || null,
      languages_known: payload.languages_known?.trim() || null,
      entertainment_preferences:
        payload.entertainment_preferences?.trim() || null,
      travel_interests: payload.travel_interests?.trim() || null,
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    if (recordId) {
      const existing = await this.hobbiesManagementRepo.findOne({
        where: {
          id: recordId,
          user_id: targetUserId,
        },
      });
      if (!existing) {
        throw new NotFoundException(
          `Hobbies ID: ${recordId} for User ID: ${targetUserId} not found`,
        );
      }

      await this.hobbiesManagementRepo.update(
        { id: recordId, user_id: targetUserId },
        updateCreateData,
      );

      const updated = await this.hobbiesManagementRepo.findOne({
        where: { id: recordId },
      });

      return {
        message: 'Hobbies info updated successfully',
        data: updated,
      };
    }

    const newHobbies = this.hobbiesManagementRepo.create({
      ...updateCreateData,
      user_id: targetUserId,
      created_at: new Date(),
    });

    const saved = await this.hobbiesManagementRepo.save(newHobbies);

    return {
      message: 'Hobbies info created successfully',
      data: saved,
    };
  }

  public async deleteHobbies(id: number) {
    const record = await this.hobbiesManagementRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(
        `Hobbies record metadata entry targeting ID ${id} not found.`,
      );
    }

    await this.hobbiesManagementRepo.remove(record);
    return {
      message: 'Hobbies log completely removed from the profile schema.',
    };
  }
}
