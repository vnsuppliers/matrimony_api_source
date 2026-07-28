import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUpdatePhysicalAttributesDto } from 'src/dto/create_update_physical_attributes.dto';
import { PhysicalAttributesEntity } from 'src/entities/physical_attributes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhysicalAttributesService {
  constructor(
    @InjectRepository(PhysicalAttributesEntity)
    private readonly physicalAttributesRepo: Repository<PhysicalAttributesEntity>,
  ) {}

  public async get_physical_attributes(user_id: number) {
    const data = await this.physicalAttributesRepo.findOne({
      where: { user_id },
    });

    if (!data) {
      throw new NotFoundException(`Lifestyle not found for userId: ${user_id}`);
    }

    return {
      success: true,
      message: 'Physical attributes fetched successfully',
      data,
    };
  }

  public async update_create_physical_attributes(
    user_id: number,
    dto: CreateUpdatePhysicalAttributesDto,
  ) {
    const existing = await this.physicalAttributesRepo.findOne({
      where: { user_id },
    });

    if (existing) {
      Object.assign(existing, dto);

      const updated = await this.physicalAttributesRepo.save(existing);

      return {
        success: true,
        message: 'Physical attributes updated successfully',
        data: updated,
      };
    }

    const created = this.physicalAttributesRepo.create({
      user_id,
      ...dto,
    });

    await this.physicalAttributesRepo.save(created);

    return {
      success: true,
      message: 'Lifestyle created successfully',
      data: created,
    };
  }
}
