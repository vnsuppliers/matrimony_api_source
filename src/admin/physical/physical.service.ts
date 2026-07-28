import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdatePhysicalAttributesDto } from 'src/dto/create_update_physical_attributes.dto';
import { PhysicalAttributesEntity } from 'src/entities/physical_attributes.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhysicalService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(PhysicalAttributesEntity)
    private readonly physicalAttributeRepo: Repository<PhysicalAttributesEntity>,
  ) {}

  public async update_create(
    targetUserId: number,
    payload: CreateUpdatePhysicalAttributesDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException(
        'The requested user profile could not be found.',
      );
    }

    // Forcefully remove key tracking fields so they never overwrite or corrupt your DB state
    const cleanAttributes = { ...payload } as Record<string, any>;
    delete cleanAttributes.id;
    delete cleanAttributes.user_id;
    delete cleanAttributes.created_at;
    delete cleanAttributes.updated_at;

    try {
      let record = await this.physicalAttributeRepo.findOne({
        where: { user_id: targetUserId },
      });

      let isNewRecord = false;

      if (record) {
        Object.assign(record, cleanAttributes);
      } else {
        isNewRecord = true;
        record = new PhysicalAttributesEntity();
        record.user_id = targetUserId;
        Object.assign(record, cleanAttributes);
      }

      const savedRecord = await this.physicalAttributeRepo.save(record);

      return {
        message: isNewRecord
          ? 'Physical profile attributes have been successfully created.'
          : 'Physical profile attributes have been successfully updated.',
        data: savedRecord,
      };
    } catch (error) {
      // Hides deep technical database codes from users
      throw new InternalServerErrorException(
        'An error occurred while saving the physical details. Please double-check your entries.',
      );
    }
  }

  public async deleteByUserId(targetUserId: number) {
    try {
      const record = await this.physicalAttributeRepo.findOne({
        where: { user_id: targetUserId },
      });

      if (!record) {
        throw new NotFoundException(
          'No physical attributes data was found for this user.',
        );
      }

      await this.physicalAttributeRepo.remove(record);

      return {
        message: 'The physical attribute records have been cleared completely.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Unable to complete the removal request right now. Please try again later.',
      );
    }
  }
}
