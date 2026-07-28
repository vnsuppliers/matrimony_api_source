import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyInfoDto } from 'src/dto/family_info.dto';
import { FamilyInfoEntity } from 'src/entities/family_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FamilyManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(FamilyInfoEntity)
    private readonly familyRepo: Repository<FamilyInfoEntity>,
  ) {}

  public async update_create(targetUserId: number, payload: FamilyInfoDto) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(
        'The requested user profile could not be found.',
      );
    }

    const createUpdateData = {
      father_name: payload.father_name,
      father_occupation: payload.father_occupation,
      father_education: payload.father_education,
      father_status: payload.father_status,
      mother_name: payload.mother_name,
      mother_occupation: payload.mother_occupation,
      mother_education: payload.mother_education,
      mother_status: payload.mother_status,
      family_type: payload.family_type,
      family_values: payload.family_values,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      address: payload.address,
      pincode: payload.pincode,
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    try {
      if (recordId) {
        const record = await this.familyRepo.findOne({
          where: { id: recordId },
        });
        if (!record) {
          throw new NotFoundException(
            'This family entry record could not be located.',
          );
        }

        Object.assign(record, createUpdateData);
        const saved = await this.familyRepo.save(record);

        return {
          message: 'Family infrastructure details modified successfully.',
          data: saved,
        };
      }

      const newRecord = this.familyRepo.create({
        ...createUpdateData,
        user_id: targetUserId,
      });

      const saved = await this.familyRepo.save(newRecord);

      return {
        message: 'Family infrastructure details registered successfully.',
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An error occurred while saving family details. Please verify your data entry and try again.',
      );
    }
  }

  public async deleteByUserId(targetUserId: number) {
    try {
      const record = await this.familyRepo.findOne({
        where: { user_id: targetUserId },
      });
      if (!record) {
        throw new NotFoundException(
          'No family records were found for this user context.',
        );
      }

      await this.familyRepo.remove(record);
      return { message: 'The family registry has been completely cleared.' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Unable to remove the requested family record entry right now. Please try again later.',
      );
    }
  }
}
