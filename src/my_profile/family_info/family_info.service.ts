import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyInfoDto } from 'src/dto/family_info.dto';
import { FamilyInfoEntity } from 'src/entities/family_info.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FamilyInfoService {
  constructor(
    @InjectRepository(FamilyInfoEntity)
    private readonly familyInfoRepository: Repository<FamilyInfoEntity>,
  ) {}

  public async get_famil_info_by_user_id(user_id: number) {
    const family_info = await this.familyInfoRepository
      .createQueryBuilder('family_info')
      .where('family_info.user_id = :user_id', { user_id })
      .getOne();
    return family_info;
  }

  public async update_create_family_info(user_id: number, dto: FamilyInfoDto) {
    try {
      console.log('USER ID =>', user_id);
      console.log('DTO =>', dto);

      const payload = {
        ...dto,

        country_id: dto.country_id || null,
        state_id: dto.state_id || null,
        city_id: dto.city_id || null,
        pincode: dto.pincode || null,
      };

      console.log('PAYLOAD =>', payload);

      let family_info = await this.familyInfoRepository.findOne({
        where: { user_id },
      });

      if (!family_info) {
        family_info = this.familyInfoRepository.create({
          user_id,
          ...payload,
        });

        await this.familyInfoRepository.save(family_info);

        return {
          message: 'Family info created successfully',
        };
      }

      await this.familyInfoRepository.update(
        { user_id },
        {
          ...payload,
        },
      );

      return {
        message: 'Family info updated successfully',
      };
    } catch (error) {
      console.log('FAMILY INFO ERROR =>', error);

      throw error;
    }
  }
}
