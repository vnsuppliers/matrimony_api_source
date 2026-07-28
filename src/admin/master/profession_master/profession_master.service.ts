import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionMasterEntity } from 'src/entities/profession_master.entity';
import { Repository, Not } from 'typeorm';

@Injectable()
export class ProfessionMasterService {
  constructor(
    @InjectRepository(ProfessionMasterEntity)
    private readonly professionMasterRepository: Repository<ProfessionMasterEntity>,
  ) {}

  public async get_profession_master() {
    const profession_maser_list = await this.professionMasterRepository.find({
      where: { status: 1 },
    });
    return profession_maser_list;
  }

  // ==========================================================
  // NEW CONFIGURATION PIPELINES
  // ==========================================================

  /**
   * Fetches paginated dashboard records
   */
  async get_profession_master_data(page: number = 1, limit: number = 10) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const [masterData, totalItems] =
      await this.professionMasterRepository.findAndCount({
        order: { id: 'DESC' },
        take: safeLimit,
        skip: skipAmount,
      });

    return {
      masterData: masterData || [],
      meta: {
        totalItems: totalItems || 0,
        totalPages: Math.ceil((totalItems || 0) / safeLimit),
        currentPage: currentPage,
        limit: safeLimit,
      },
    };
  }

  /**
   * Dual handler: Creates new entries or modifies existing master rows
   */
  async update_create(
    id: number,
    payload: { profession_name: string; status: number },
  ) {
    const trimmedName = payload.profession_name.trim();

    if (id > 0) {
      // Update pipeline
      const profession = await this.professionMasterRepository.findOne({
        where: { id },
      });
      if (!profession) {
        throw new NotFoundException(
          `Profession registry track ID:${id} not found`,
        );
      }

      const nameConflict = await this.professionMasterRepository.findOne({
        where: { profession_name: trimmedName, id: Not(id) },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A profession category named '${trimmedName}' already exists`,
        );
      }

      profession.profession_name = trimmedName;
      profession.status = payload.status;
      await this.professionMasterRepository.save(profession);

      return {
        message: 'Profession records updated successfully',
        status: true,
      };
    } else {
      // Create pipeline
      const nameConflict = await this.professionMasterRepository.findOne({
        where: { profession_name: trimmedName },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A profession category named '${trimmedName}' already exists`,
        );
      }

      // Safe primary key counter synchronization mapping lookup
      const result = await this.professionMasterRepository
        .createQueryBuilder('prof')
        .select('MAX(prof.id)', 'maxId')
        .getRawOne();
      const currentMaxId = result?.maxId ? parseInt(result.maxId, 10) : 0;
      const nextId = currentMaxId + 1;

      const newProfession = this.professionMasterRepository.create({
        id: nextId,
        profession_name: trimmedName,
        status: payload.status,
      });

      await this.professionMasterRepository.save(newProfession);
      return {
        message: 'New profession sector registered successfully',
        status: true,
      };
    }
  }

  /**
   * Hard-deletes an entry row from indices
   */
  async delete_master_data(id: number) {
    const profession = await this.professionMasterRepository.findOne({
      where: { id },
    });
    if (!profession) {
      throw new NotFoundException(
        `Profession master category ID:${id} does not exist`,
      );
    }

    await this.professionMasterRepository.delete(profession.id);
    return {
      message: 'Profession permanently deleted from database records',
      status: true,
    };
  }
}
