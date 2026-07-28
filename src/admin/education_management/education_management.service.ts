import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationInfoEntity } from 'src/entities/education_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EducationManagementService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(EducationInfoEntity)
    private readonly eduRepo: Repository<EducationInfoEntity>,
  ) {}

  public async update_create(
    userId: number,
    payload: Partial<EducationInfoEntity> & { id?: number; user_id?: number },
  ) {
    const targetUserId = payload.user_id ?? userId;

    // Verify target user exists
    const user = await this.userRepo.findOne({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException(
        'The requested user profile could not be found.',
      );
    }

    const updateData = {
      education_id: payload.education_id,
      specialisation_id: payload.specialisation_id,
      college_name: payload.college_name,
      university_name: payload.university_name,
      passing_year: payload.passing_year,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      education_address: payload.education_address,
      status: payload.status,
      education_info_status: payload.education_info_status,
      is_highest_education: payload.is_highest_education,
      updated_at: new Date(),
    };

    const id = payload.id ? Number(payload.id) : undefined;

    try {
      // Handle Update Logic if an ID is provided
      if (id) {
        const record = await this.eduRepo.findOne({ where: { id } });

        if (!record) {
          throw new NotFoundException(
            'This education entry could not be located.',
          );
        }

        Object.assign(record, updateData);
        const updatedRecord = await this.eduRepo.save(record);

        return {
          message: 'Education history record has been successfully updated.',
          data: updatedRecord,
        };
      }

      // Handle Create Logic if no ID is provided
      const newRecord = this.eduRepo.create({
        ...updateData,
        user_id: targetUserId,
      });

      const saved = await this.eduRepo.save(newRecord);

      return {
        message: 'Education history record has been successfully added.',
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while trying to save this education entry. Please verify your data fields and try again.',
      );
    }
  }

  /**
   * Deletes a specific education entry by its record ID
   */
  public async deleteRecord(id: number) {
    try {
      const record = await this.eduRepo.findOne({ where: { id } });

      if (!record) {
        throw new NotFoundException(
          'The education record you are trying to delete does not exist.',
        );
      }

      await this.eduRepo.remove(record);

      return {
        message: 'The education milestone has been permanently removed.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Unable to remove the requested education entry right now. Please try again later.',
      );
    }
  }
}
