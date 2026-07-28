import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LifeStyleInfoDto } from 'src/dto/life_syle_info.dto';
import { LifestyleInfoEntity } from 'src/entities/lifestyle_info.entity';

@Injectable()
export class LifestyleInfoService {
  constructor(
    @InjectRepository(LifestyleInfoEntity)
    private readonly repo: Repository<LifestyleInfoEntity>,
  ) {}

  // ================= GET =================
  public async get(user_id: number) {
    const data = await this.repo.findOne({
      where: { user_id },
    });

    if (!data) {
      throw new NotFoundException(`Lifestyle not found for userId: ${user_id}`);
    }

    return {
      success: true,
      message: 'Lifestyle fetched successfully',
      data,
    };
  }

  // ================= UPSERT (CREATE OR UPDATE) =================
  public async create_update(user_id: number, dto: LifeStyleInfoDto) {
    const existing = await this.repo.findOne({
      where: { user_id },
    });

    if (existing) {
      Object.assign(existing, dto);

      const updated = await this.repo.save(existing);

      return {
        success: true,
        message: 'Lifestyle updated successfully',
        data: updated,
      };
    }

    const created = this.repo.create({
      user_id,
      ...dto,
    });

    await this.repo.save(created);

    return {
      success: true,
      message: 'Lifestyle created successfully',
      data: created,
    };
  }
}
