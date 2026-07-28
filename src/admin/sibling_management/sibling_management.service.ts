import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiblingsInfoDto } from 'src/dto/siblings_info.dto';
import { SiblingsInfoEntity } from 'src/entities/siblings_info_entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SiblingManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(SiblingsInfoEntity)
    private readonly siblingsRepo: Repository<SiblingsInfoEntity>,
  ) {}

  public async update_create(targetUserId: number, payload: SiblingsInfoDto) {
    const user = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(
        'The requested user profile could not be found.',
      );
    }

    const updateCreateData = {
      name: payload.name,
      date_of_birth: payload.date_of_birth,
      relation: payload.relation,
      is_elder: payload.is_elder,
      marital_status: payload.marital_status,
      educational_qualification: payload.educational_qualification,
      profession: payload.profession,
      company_name: payload.company_name,
      spouse_name: payload.spouse_name,
      spouse_profession: payload.spouse_profession,
      children_count: payload.children_count,
      additional_notes: payload.additional_notes,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    try {
      if (recordId) {
        const record = await this.siblingsRepo.findOne({
          where: { id: recordId },
        });
        if (!record) {
          throw new NotFoundException(
            'This sibling information record could not be located.',
          );
        }

        Object.assign(record, updateCreateData);
        const saved = await this.siblingsRepo.save(record);

        return {
          message: 'Sibling parameters setup modified successfully.',
          data: saved,
        };
      }

      const newRecord = this.siblingsRepo.create({
        ...updateCreateData,
        user_id: targetUserId,
        created_at: new Date(),
      });

      const saved = await this.siblingsRepo.save(newRecord);

      return {
        message: 'Sibling parameters setup registered successfully.',
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An error occurred while saving the details. Please clarify your inputs and try again.',
      );
    }
  }

  public async deleteRecord(id: number) {
    try {
      const record = await this.siblingsRepo.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(
          'The sibling record you are trying to erase does not exist.',
        );
      }

      await this.siblingsRepo.remove(record);
      return {
        message: 'The targeted relationship row has been permanently wiped.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Unable to drop the request log index parameter right now. Please try again later.',
      );
    }
  }
}
