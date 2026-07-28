import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { GenderEntity } from 'src/entities/gender.entity';
import { CreateGenderDto } from 'src/dto/gender_master.dto';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(GenderEntity)
    private readonly genderRepository: Repository<GenderEntity>,
  ) {}

  /**
   * Fetches only active items (status: 1) for regular selection flows
   */
  public async getall() {
    return await this.genderRepository.find({ where: { status: 1 } });
  }

  /**
   * Get Master data with pagination configurations
   */
  public async get_gender_master_data(page: number = 1, limit: number = 10) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const [masterData, totalItems] = await this.genderRepository.findAndCount({
      order: { id: 'DESC' },
      take: safeLimit,
      skip: skipAmount,
    });

    if (!masterData || masterData.length === 0) {
      return {
        masterData: [],
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: currentPage,
          limit: safeLimit,
        },
        message: 'Gender master data does not exist',
        status: true,
      };
    }

    return {
      masterData,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit),
        currentPage: currentPage,
        limit: safeLimit,
      },
    };
  }

  /**
   * Dual pipeline: Creates new rows or manages safe mutation updates on existing records
   */
  public async update_create(id: number, payload: CreateGenderDto) {
    const trimmedName = payload.name.trim();

    if (id > 0) {
      // 1. UPDATE PIPELINE FLOW ROUTINE
      const record = await this.genderRepository.findOne({ where: { id } });
      if (!record) {
        throw new NotFoundException(
          `Gender registry records with ID:${id} not found`,
        );
      }

      // Check for conflict duplication exclusions
      const nameConflict = await this.genderRepository.findOne({
        where: { name: trimmedName, id: Not(id) },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A gender with classification name '${trimmedName}' already exists`,
        );
      }

      record.name = trimmedName;
      record.status = payload.status;

      await this.genderRepository.save(record);
      return {
        message: 'Gender entry configurations modified successfully',
        status: true,
      };
    } else {
      // 2. CREATE PIPELINE FLOW ROUTINE
      const nameConflict = await this.genderRepository.findOne({
        where: { name: trimmedName },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A gender classification named '${trimmedName}' already exists`,
        );
      }

      const newGender = this.genderRepository.create({
        name: trimmedName,
        status: payload.status,
      });

      await this.genderRepository.save(newGender);
      return {
        message: 'New gender item registered successfully',
        status: true,
      };
    }
  }

  /**
   * Wipe row record completely out of database master records
   */
  public async delete_master_data(id: number) {
    const masterData = await this.genderRepository.findOne({
      where: { id: id },
    });

    if (!masterData) {
      throw new NotFoundException(
        `Gender entry matching ID:${id} does not exist`,
      );
    }

    await this.genderRepository.delete(masterData.id);

    return {
      message: 'Gender registry configuration row deleted successfully',
      status: true,
    };
  }
}
