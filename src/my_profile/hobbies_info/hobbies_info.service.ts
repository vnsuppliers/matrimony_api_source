import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';

import { HobbiesInfoEntity } from 'src/entities/hobbies_info.entity';

import { CreateUpdateHobbiesInfoDto } from 'src/dto/create_update_hobbies_info.dto';
import { encryptId } from 'src/common/utils/encryption.util';

@Injectable()
export class HobbiesInfoService {
  constructor(
    @InjectRepository(HobbiesInfoEntity)
    private readonly hobbiesRepo: Repository<HobbiesInfoEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ================= GET =================
  async get_hobbies_info(user_id: number) {
    const hobbies = await this.hobbiesRepo.find({
      where: { user_id },
      order: {
        id: 'DESC',
      },
    });

    const formatted = hobbies.map((item) => ({
      ...item,
      encrypted_id: encryptId(item.id),
    }));

    return {
      success: true,
      message: 'Hobbies info fetched successfully',
      data: formatted,
    };
  }

  // ================= CREATE =================
  async create_hobbies_info(user_id: number, dto: CreateUpdateHobbiesInfoDto) {
    const newRow = this.hobbiesRepo.create({
      user_id,

      hobbies: dto.hobbies || null,

      interests: dto.interests || null,

      favorite_music: dto.favorite_music || null,

      favorite_movies: dto.favorite_movies || null,

      favorite_books: dto.favorite_books || null,

      sports: dto.sports || null,

      activities: dto.activities || null,

      languages_known: dto.languages_known || null,

      entertainment_preferences: dto.entertainment_preferences || null,

      travel_interests: dto.travel_interests || null,

      status: dto.status ?? 1,
    });

    const saved = await this.hobbiesRepo.save(newRow);

    return {
      success: true,
      message: 'Hobbies info created successfully',
      data: saved,
    };
  }

  // ================= UPDATE =================
  async update_hobbies_info(
    hobbies_info_id: number,
    dto: CreateUpdateHobbiesInfoDto,
  ) {
    const existing = await this.hobbiesRepo.findOne({
      where: { id: hobbies_info_id },
    });

    console.log('Hobbies id', hobbies_info_id);

    if (!existing) {
      throw new NotFoundException('Hobbies info not found');
    }

    await this.hobbiesRepo.update(
      { id: hobbies_info_id },
      {
        hobbies: dto.hobbies ?? existing.hobbies,

        interests: dto.interests ?? existing.interests,

        favorite_music: dto.favorite_music ?? existing.favorite_music,

        favorite_movies: dto.favorite_movies ?? existing.favorite_movies,

        favorite_books: dto.favorite_books ?? existing.favorite_books,

        sports: dto.sports ?? existing.sports,

        activities: dto.activities ?? existing.activities,

        languages_known: dto.languages_known ?? existing.languages_known,

        entertainment_preferences:
          dto.entertainment_preferences ?? existing.entertainment_preferences,

        travel_interests: dto.travel_interests ?? existing.travel_interests,

        status: dto.status ?? existing.status,
      },
    );

    const updated = await this.hobbiesRepo.findOne({
      where: { id: hobbies_info_id },
    });

    return {
      success: true,
      message: 'Hobbies info updated successfully',
      data: updated,
    };
  }

  // ================= DELETE =================
  async delete_hobbies_info(hobbies_info_id: number) {
    const existing = await this.hobbiesRepo.findOne({
      where: { id: hobbies_info_id },
    });

    console.log('Hobbies id', hobbies_info_id);

    if (!existing) {
      throw new NotFoundException('Hobbies info not found');
    }

    await this.hobbiesRepo.delete({
      id: hobbies_info_id,
    });

    return {
      success: true,
      message: 'Hobbies info deleted successfully',
    };
  }
}
