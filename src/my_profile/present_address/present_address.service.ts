import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PresentAddressDto } from 'src/dto/present_address.dto';
import { PresentAddressEntity } from 'src/entities/present_address.entity';

@Injectable()
export class PresentAddressService {
  constructor(
    @InjectRepository(PresentAddressEntity)
    private readonly presentAddressRepository: Repository<PresentAddressEntity>,
  ) {}

  public async get_present_address_by_user_id(user_id: number) {
    const present_address = await this.presentAddressRepository
      .createQueryBuilder('present_address')
      .where('present_address.user_id = :user_id', { user_id })
      .getOne();

    return present_address;
  }

  public async update_create_present_address(
    user_id: number,
    dto: PresentAddressDto,
  ) {
    try {
      //   console.log('USER ID =>', user_id);
      //   console.log('DTO =>', dto);

      const payload = {
        ...dto,

        country_id: dto.country_id || null,
        state_id: dto.state_id || null,
        city_id: dto.city_id || null,
        pincode: dto.pincode || null,
      };

      //   console.log('PAYLOAD =>', payload);

      let present_address = await this.presentAddressRepository.findOne({
        where: { user_id },
      });

      if (!present_address) {
        present_address = this.presentAddressRepository.create({
          user_id,
          ...payload,
        });

        await this.presentAddressRepository.save(present_address);

        return {
          message: 'Present address created successfully',
        };
      }

      await this.presentAddressRepository.update(
        { user_id },
        {
          ...payload,
        },
      );

      return {
        message: 'Present address updated successfully',
      };
    } catch (error) {
      console.log('PRESENT ADDRESS ERROR =>', error);

      throw error;
    }
  }
}
