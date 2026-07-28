import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { SiblingsInfoEntity } from 'src/entities/siblings_info_entity';

import { encryptId } from 'src/common/utils/encryption.util';

import { SiblingsInfoDto } from 'src/dto/siblings_info.dto';

@Injectable()
export class SiblingsInfoService {
  constructor(
    @InjectRepository(SiblingsInfoEntity)
    private readonly siblingsInfoRepository: Repository<SiblingsInfoEntity>,
  ) {}

  // ================= GET =================
  async get_siblings_info_by_user_id(user_id: number) {
    const rows = await this.siblingsInfoRepository.find({
      where: {
        user_id,
      },

      order: {
        id: 'ASC',
      },
    });

    return rows.map((row) => ({
      ...row,

      encrypted_id: encryptId(row.id),
    }));
  }

  // ================= CREATE =================
  async create_siblings_info(
    user_id: number,

    dto: SiblingsInfoDto,
  ) {
    const newRow = this.siblingsInfoRepository.create({
      user_id,

      name: dto.name || null,

      date_of_birth: dto.date_of_birth || null,

      relation: dto.relation || null,

      is_elder: dto.is_elder ? Number(dto.is_elder) : 0,

      marital_status: dto.marital_status || null,

      educational_qualification: dto.educational_qualification || null,

      profession: dto.profession || null,

      company_name: dto.company_name || null,

      spouse_name: dto.spouse_name || null,

      spouse_profession: dto.spouse_profession || null,

      children_count: dto.children_count || null,

      additional_notes: dto.additional_notes || null,

      country_id: dto.country_id ? Number(dto.country_id) : null,

      state_id: dto.state_id ? Number(dto.state_id) : null,

      city_id: dto.city_id ? Number(dto.city_id) : null,

      status: dto.status ?? 1,
    });

    return await this.siblingsInfoRepository.save(newRow);
  }

  // ================= UPDATE =================
  async update_siblings_info(
    sibling_info_id: number,

    dto: SiblingsInfoDto,
  ) {
    const existing = await this.siblingsInfoRepository.findOne({
      where: {
        id: sibling_info_id,
      },
    });

    if (!existing) {
      throw new Error('Sibling info not found');
    }

    await this.siblingsInfoRepository.update(
      {
        id: sibling_info_id,
      },

      {
        name: dto.name || null,

        date_of_birth: dto.date_of_birth || null,

        relation: dto.relation || null,

        is_elder: dto.is_elder ? Number(dto.is_elder) : existing.is_elder,

        marital_status: dto.marital_status || null,

        educational_qualification: dto.educational_qualification || null,

        profession: dto.profession || null,

        company_name: dto.company_name || null,

        spouse_name: dto.spouse_name || null,

        spouse_profession: dto.spouse_profession || null,

        children_count: dto.children_count || null,

        additional_notes: dto.additional_notes || null,

        country_id: dto.country_id ? Number(dto.country_id) : null,

        state_id: dto.state_id ? Number(dto.state_id) : null,

        city_id: dto.city_id ? Number(dto.city_id) : null,

        status: dto.status ?? existing.status,
      },
    );

    return await this.siblingsInfoRepository.findOne({
      where: {
        id: sibling_info_id,
      },
    });
  }

  // ================= DELETE =================
  async delete_siblings_info(sibling_info_id: number) {
    return await this.siblingsInfoRepository.delete({
      id: sibling_info_id,
    });
  }
}
