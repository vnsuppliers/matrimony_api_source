import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProfessionInfoEntity } from 'src/entities/profession_info.entity';

import { CreateUpdateProfessionInfoDto } from 'src/dto/create_update_profession_info.dto';

import { encryptId } from 'src/common/utils/encryption.util';

@Injectable()
export class ProfessionInfoService {
  constructor(
    @InjectRepository(ProfessionInfoEntity)
    private readonly professionInfoRepo: Repository<ProfessionInfoEntity>,
  ) {}

  // ================= GET BY USER =================
  async get_profession_info(user_id: number) {
    const rows = await this.professionInfoRepo.find({
      where: { user_id },
      relations: {
        profession: true,
        designation: true,
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
  async create_profession_info(
    user_id: number,
    dto: CreateUpdateProfessionInfoDto,
  ) {
    // FIX: explicitly list only column fields, never spread dto
    const newRow = this.professionInfoRepo.create({
      user_id,

      profession_id: dto.profession_id ? Number(dto.profession_id) : null,
      designation_id: dto.designation_id ? Number(dto.designation_id) : null,
      country_id: dto.country_id ? Number(dto.country_id) : null,
      state_id: dto.state_id ? Number(dto.state_id) : null,
      city_id: dto.city_id ? Number(dto.city_id) : null,

      company_name: dto.company_name || null,
      experience: dto.experience || null,
      income: dto.income || null,
      location: dto.location || null,
      description: dto.description || null,
      status: dto.status ?? 1,
    });

    return await this.professionInfoRepo.save(newRow);
  }

  // ================= UPDATE =================
  async update_profession_info(
    profession_info_id: number,
    dto: CreateUpdateProfessionInfoDto,
  ) {
    const existing = await this.professionInfoRepo.findOne({
      where: { id: profession_info_id },
    });

    if (!existing) {
      throw new Error('Profession info not found');
    }

    // FIX: explicitly list only column fields, never spread dto
    await this.professionInfoRepo.update(
      { id: profession_info_id },
      {
        profession_id: dto.profession_id ? Number(dto.profession_id) : null,
        designation_id: dto.designation_id ? Number(dto.designation_id) : null,
        country_id: dto.country_id ? Number(dto.country_id) : null,
        state_id: dto.state_id ? Number(dto.state_id) : null,
        city_id: dto.city_id ? Number(dto.city_id) : null,

        company_name: dto.company_name || null,
        experience: dto.experience || null,
        income: dto.income || null,
        location: dto.location || null,
        description: dto.description || null,
        status: dto.status ?? existing.status,
      },
    );

    return await this.professionInfoRepo.findOne({
      where: { id: profession_info_id },
      relations: {
        profession: true,
        designation: true,
      },
    });
  }

  // ================= DELETE =================
  async delete_profession_info(profession_info_id: number) {
    return await this.professionInfoRepo.delete({
      id: profession_info_id,
    });
  }
}
