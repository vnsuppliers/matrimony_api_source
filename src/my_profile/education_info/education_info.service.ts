import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationInfoEntity } from 'src/entities/education_info.entity';
import { CreateEducationInfoDto } from 'src/dto/create_education_info.dto';
import { encryptId } from 'src/common/utils/encryption.util';

@Injectable()
export class EducationInfoService {
  constructor(
    @InjectRepository(EducationInfoEntity)
    private readonly educationRepo: Repository<EducationInfoEntity>,
  ) {}

  async get_education_info(user_id: number) {
    const rows = await this.educationRepo.find({
      where: { user_id },
      order: { id: 'ASC' },
    });

    // attach encrypted_id to every row so frontend can use it
    return rows.map((row) => ({
      ...row,
      encrypted_id: encryptId(row.id),
    }));
  }

  async create_education_info(user_id: number, dto: CreateEducationInfoDto) {
    if (dto.is_highest_education) {
      await this.educationRepo.update({ user_id }, { is_highest_education: 0 });
    }
    const newRow = this.educationRepo.create({ user_id, ...dto });
    return this.educationRepo.save(newRow);
  }

  async update_education_info(
    education_id: number,
    dto: CreateEducationInfoDto,
  ) {
    const existing = await this.educationRepo.findOne({
      where: { id: education_id },
    });
    if (!existing) throw new Error('Record not found');

    if (dto.is_highest_education) {
      await this.educationRepo.update(
        { user_id: existing.user_id },
        { is_highest_education: 0 },
      );
    }

    await this.educationRepo.update({ id: education_id }, dto);
    return this.educationRepo.findOne({ where: { id: education_id } });
  }

  async delete_education_info(education_id: number) {
    return this.educationRepo.delete({ id: education_id });
  }
}
