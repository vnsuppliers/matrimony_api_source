import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateProfessionInfoDto } from 'src/dto/create_update_profession_info.dto';
import { ProfessionInfoEntity } from 'src/entities/profession_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessionManagementService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProfessionInfoEntity)
    private readonly professionRepo: Repository<ProfessionInfoEntity>,
  ) {}

  async update_create(
    targetUserId: number,
    payload: CreateUpdateProfessionInfoDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException(
        'The requested user profile could not be found.',
      );
    }

    const updateData = {
      profession_id: payload.profession_id,
      designation_id: payload.designation_id,
      company_name: payload.company_name,
      experience: payload.experience,
      income: payload.income,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      location: payload.location,
      description: payload.description,
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    try {
      // Handle Update Logic if an explicit ID is targeting an existing log row entry
      if (recordId) {
        const record = await this.professionRepo.findOne({
          where: { id: recordId },
        });

        if (!record) {
          throw new NotFoundException(
            'This professional record entry could not be located.',
          );
        }

        Object.assign(record, updateData);
        const saved = await this.professionRepo.save(record);

        return {
          message: 'Professional experience history card updated successfully.',
          data: saved,
        };
      }

      // Handle Create Logic if no record ID exists (safely attaches to the target user)
      const newRecord = this.professionRepo.create({
        ...updateData,
        user_id: targetUserId,
      });

      const saved = await this.professionRepo.save(newRecord);

      return {
        message: 'Professional experience history card added successfully.',
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'An error occurred while saving the professional details. Please verify your fields and try again.',
      );
    }
  }

  /**
   * Deletes a specific historical workspace assignment log entry by primary ID
   */
  async deleteRecord(id: number) {
    try {
      const record = await this.professionRepo.findOne({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException(
          'The profession record you are trying to delete does not exist.',
        );
      }

      await this.professionRepo.remove(record);

      return {
        message: 'The workspace history entry has been permanently removed.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Unable to remove the requested workplace entry right now. Please try again later.',
      );
    }
  }
}
