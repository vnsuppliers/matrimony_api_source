import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LifeStyleInfoDto } from 'src/dto/life_syle_info.dto';
import { LifestyleInfoEntity } from 'src/entities/lifestyle_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LifestyleManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LifestyleInfoEntity)
    private readonly lifestyleInfoRepo: Repository<LifestyleInfoEntity>,
  ) {}

  public async update_create(targetUserId: number, payload: LifeStyleInfoDto) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User not found with ID: ${targetUserId}`);
    }

    const updateCreateData = {
      diet: payload.diet?.trim() || null,
      smoking: payload.smoking?.trim() || null,
      drinking: payload.drinking?.trim() || null,
      body_type: payload.body_type?.trim() || null,
      physical_status: payload.physical_status?.trim() || null,
      fitness_level: payload.fitness_level?.trim() || null,
      sleep_habit: payload.sleep_habit?.trim() || null,
      wake_up_time: payload.wake_up_time?.trim() || null,
      family_type: payload.family_type?.trim() || null,
      living_style: payload.living_style?.trim() || null,
      social_habits: payload.social_habits?.trim() || null,
      travel_habits: payload.travel_habits?.trim() || null,
      food_habits: payload.food_habits?.trim() || null,
      fashion_style: payload.fashion_style?.trim() || null,
      pet_preference: payload.pet_preference?.trim() || null,
      driving_habit: payload.driving_habit?.trim() || null,
      work_life_balance: payload.work_life_balance?.trim() || null,
      religious_life_style: payload.religious_life_style?.trim() || null,
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    if (recordId) {
      const existing = await this.lifestyleInfoRepo.findOne({
        where: { id: recordId, user_id: targetUserId },
      });
      if (!existing) {
        throw new NotFoundException(
          `Life style record ID: ${recordId} not found for User ID: ${targetUserId}`,
        );
      }

      await this.lifestyleInfoRepo.update(
        { id: recordId, user_id: targetUserId },
        updateCreateData,
      );

      const updated = await this.lifestyleInfoRepo.findOne({
        where: { id: recordId },
      });

      return {
        message: 'Lifestyle info updated successfully',
        data: updated,
      };
    }

    const newLifestyle = this.lifestyleInfoRepo.create({
      ...updateCreateData,
      user_id: targetUserId,
      created_at: new Date(),
    });

    const saved = await this.lifestyleInfoRepo.save(newLifestyle);

    return {
      message: 'Lifestyle info created successfully',
      data: saved,
    };
  }

  public async deleteLifestyle(id: number) {
    const record = await this.lifestyleInfoRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(
        `Lifestyle metadata profile log entry matching target key id ${id} not found.`,
      );
    }

    await this.lifestyleInfoRepo.remove(record);
    return { message: 'Lifestyle entry data parameters flushed cleanly.' };
  }
}
