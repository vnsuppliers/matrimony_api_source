import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAstronomicInfoDto } from 'src/dto/astronomic_info.dto';
import { AstronomicInfoEntity } from 'src/entities/astronomic_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AstroManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(AstronomicInfoEntity)
    private readonly astroManagementRepo: Repository<AstronomicInfoEntity>,
  ) {}

  public async update_create(
    targetUserId: number,
    payload: CreateAstronomicInfoDto,
  ) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User not found with ID: ${targetUserId}`);
    }

    const updateCreateData = {
      zodiac_sign: payload.zodiac_sign,
      moon_sign: payload.moon_sign?.trim() || null,
      padam: payload.padam?.trim() || null,
      place_of_birth: payload.place_of_birth?.trim() || null,
      time_of_birth: payload.time_of_birth?.trim() || null,
      gothram: payload.gothram?.trim() || null,
      astro_notes: payload.astro_notes?.trim() || null,
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    if (recordId) {
      const existing = await this.astroManagementRepo.findOne({
        where: { id: recordId, user_id: targetUserId },
      });
      if (!existing) {
        throw new NotFoundException(
          `Astro record ID: ${recordId} not found for User ID: ${targetUserId}`,
        );
      }

      await this.astroManagementRepo.update({ id: recordId }, updateCreateData);
      const updated = await this.astroManagementRepo.findOne({
        where: { id: recordId },
      });

      return {
        message: 'Astrology info updated successfully',
        data: updated,
      };
    }

    const newAstro = this.astroManagementRepo.create({
      ...updateCreateData,
      user_id: targetUserId,
      created_at: new Date(),
    });

    const saved = await this.astroManagementRepo.save(newAstro);
    return {
      message: 'Astrology info created successfully',
      data: saved,
    };
  }

  public async deleteAstro(id: number) {
    const record = await this.astroManagementRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(
        `Astrology data record target not found for ID: ${id}`,
      );
    }
    await this.astroManagementRepo.remove(record);
    return { message: 'Astrology record dropped successfully.' };
  }
}
