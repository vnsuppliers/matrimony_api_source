import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RelativesInfoEntity } from 'src/entities/relatives_info.entity';
import { CreateUpdateRelativesInfoDto } from 'src/dto/create_update_relatives_info.dto';
import { encryptId } from 'src/common/utils/encryption.util';

@Injectable()
export class RelativesInfoService {
  constructor(
    @InjectRepository(RelativesInfoEntity)
    private readonly relativesRepo: Repository<RelativesInfoEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async get_relatives_info(user_id: number) {
    const relatives = await this.relativesRepo.find({
      where: { user_id },
      order: { id: 'DESC' },
    });

    const formatted = relatives.map((item) => ({
      ...item,
      encrypted_id: encryptId(item.id),
    }));

    return {
      success: true,
      message: 'Relatives info fetched successfully',
      data: formatted,
    };
  }

  async create_relatives_info(
    user_id: number,
    dto: CreateUpdateRelativesInfoDto,
  ) {
    const newRow = this.relativesRepo.create({
      user_id,
      relative_name: dto.relative_name || null,
      relation: dto.relation || null,
      occupation: dto.occupation || null,
      location: dto.location || null,
      contact_number: dto.contact_number || null,
      email: dto.email || null,
      notes: dto.notes || null,
      status: dto.status ?? 1,
    });

    const saved = await this.relativesRepo.save(newRow);
    return {
      success: true,
      message: 'Relatives info created successfully',
      data: saved,
    };
  }

  async update_relatives_info(
    relatives_info_id: number,
    dto: CreateUpdateRelativesInfoDto,
  ) {
    const existing = await this.relativesRepo.findOne({
      where: { id: relatives_info_id },
    });

    if (!existing) {
      throw new NotFoundException('Relatives info not found');
    }

    await this.relativesRepo.update(
      { id: relatives_info_id },
      {
        relative_name: dto.relative_name ?? existing.relative_name,
        relation: dto.relation ?? existing.relation,
        occupation: dto.occupation ?? existing.occupation,
        location: dto.location ?? existing.location,
        contact_number: dto.contact_number ?? existing.contact_number,
        email: dto.email ?? existing.email,
        notes: dto.notes ?? existing.notes,
        status: dto.status ?? existing.status,
      },
    );

    const updated = await this.relativesRepo.findOne({
      where: { id: relatives_info_id },
    });

    return {
      success: true,
      message: 'Relatives info updated successfully',
      data: updated,
    };
  }

  async delete_relatives_info(relatives_info_id: number) {
    const existing = await this.relativesRepo.findOne({
      where: { id: relatives_info_id },
    });

    if (!existing) {
      throw new NotFoundException('Relatives info not found');
    }

    await this.relativesRepo.delete({ id: relatives_info_id });
    return {
      success: true,
      message: 'Relatives info deleted successfully',
    };
  }
}
