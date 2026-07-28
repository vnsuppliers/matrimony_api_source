import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PermanentAddressEntity } from 'src/entities/permanent_address_info.entity';
import { PermanentAddressDto } from 'src/dto/permanent_address.dto';

@Injectable()
export class PermanentAddressService {
  constructor(
    @InjectRepository(PermanentAddressEntity)
    private readonly repo: Repository<PermanentAddressEntity>,
  ) {}

  public async get_permanent_address_by_user_id(user_id: number) {
    const data = await this.repo
      .createQueryBuilder('permanent_address')
      .where('permanent_address.user_id = :user_id', { user_id })
      .getOne();

    return data;
  }

  public async update_create_permanent_address(
    user_id: number,
    dto: PermanentAddressDto,
  ) {
    try {
      const payload = {
        user_id,

        country_id: dto.country_id ? Number(dto.country_id) : null,
        state_id: dto.state_id ? Number(dto.state_id) : null,
        city_id: dto.city_id ? Number(dto.city_id) : null,

        address_line1: dto.address_line1 || null,
        address_line2: dto.address_line2 || null,
        pincode: dto.pincode || null,

        status: dto.status ?? 1,
      };

      let existing = await this.repo.findOne({
        where: { user_id },
      });

      if (!existing) {
        existing = this.repo.create(payload);

        await this.repo.save(existing);

        return {
          message: 'Permanent address created successfully',
        };
      }

      await this.repo.update({ user_id }, payload);

      return {
        message: 'Permanent address updated successfully',
      };
    } catch (error) {
      console.log('PERMANENT ADDRESS ERROR =>', error);
      throw error;
    }
  }
}
