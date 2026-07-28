import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdateRelativesInfoDto } from 'src/dto/create_update_relatives_info.dto';
import { RelativesInfoEntity } from 'src/entities/relatives_info.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RelativesManagementService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RelativesInfoEntity)
    private readonly relativesRepo: Repository<RelativesInfoEntity>,
  ) {}

  public async update_create(
    targetUserId: number,
    payload: CreateUpdateRelativesInfoDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException(
        'The requested user profile could not be found.',
      );
    }

    const updateCreateData = {
      relative_name: payload.relative_name,
      relation: payload.relation,
      occupation: payload.occupation,
      location: payload.location,
      contact_number: payload.contact_number,
      email: payload.email,
      notes: payload.notes,
      status: payload.status,
      updated_at: new Date(),
    };

    const recordId = payload.id ? Number(payload.id) : undefined;

    try {
      if (recordId) {
        const existing = await this.relativesRepo.findOne({
          where: { id: recordId, user_id: targetUserId },
        });

        if (!existing) {
          throw new NotFoundException(
            'This relative entry record could not be located.',
          );
        }

        await this.relativesRepo.update(
          { id: recordId, user_id: targetUserId },
          updateCreateData,
        );

        const updated = await this.relativesRepo.findOne({
          where: { id: recordId },
        });

        return {
          message: 'Relatives info updated successfully.',
          data: updated,
        };
      }

      const created = this.relativesRepo.create({
        ...updateCreateData,
        user_id: targetUserId,
        created_at: new Date(),
      });

      const saved = await this.relativesRepo.save(created);

      return {
        message: 'Relatives info registered successfully.',
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An error occurred while saving relative logs. Please check your data fields and try again.',
      );
    }
  }

  public async deleteRecord(id: number) {
    try {
      const record = await this.relativesRepo.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(
          'The custom relationships entry you want to wipe does not exist.',
        );
      }

      await this.relativesRepo.remove(record);
      return { message: 'The relationship card was permanently cleared.' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Unable to remove the request logging node entry parameter right now.',
      );
    }
  }
}
