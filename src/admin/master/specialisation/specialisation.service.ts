import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { SpecialisationMaster } from 'src/entities/specialisation_master.entity';

@Injectable()
export class SpecialisationService {
  constructor(
    @InjectRepository(SpecialisationMaster)
    private readonly specialisationRepository: Repository<SpecialisationMaster>,
  ) {}

  public async get_specialisations(educationId: number) {
    const specialisations = await this.specialisationRepository.find({
      where: {
        education_id: educationId,
        status: 1,
      },
      order: {
        id: 'ASC',
      },
    });

    return specialisations;
  }

  // ==========================================================
  // NEW CONFIGURATION PIPELINES
  // ==========================================================

  /**
   * Fetches admin dashboard datasets with relation mappings
   */
  async get_specialisation_master_data(page: number = 1, limit: number = 10) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const [masterData, totalItems] =
      await this.specialisationRepository.findAndCount({
        relations: ['education'],
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
    payload: { name: string; status: number; educationId: number },
  ) {
    const trimmedName = payload.name.trim();

    if (id > 0) {
      // Update pipeline
      const spec = await this.specialisationRepository.findOne({
        where: { id },
      });
      if (!spec) {
        throw new NotFoundException(
          `Specialisation tracking ID:${id} not found`,
        );
      }

      const nameConflict = await this.specialisationRepository.findOne({
        where: {
          name: trimmedName,
          education_id: payload.educationId,
          id: Not(id),
        },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A specialisation named '${trimmedName}' already exists under this education tier`,
        );
      }

      spec.name = trimmedName;
      spec.status = payload.status;
      spec.education_id = payload.educationId;
      spec.education = { id: payload.educationId } as any;

      await this.specialisationRepository.save(spec);
      return { message: 'Specialisation saved successfully', status: true };
    } else {
      // Create pipeline
      const nameConflict = await this.specialisationRepository.findOne({
        where: { name: trimmedName, education_id: payload.educationId },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A specialisation named '${trimmedName}' already exists under this education tier`,
        );
      }

      // Safe primary key counter synchronization mapping lookup
      const result = await this.specialisationRepository
        .createQueryBuilder('spec')
        .select('MAX(spec.id)', 'maxId')
        .getRawOne();
      const currentMaxId = result?.maxId ? parseInt(result.maxId, 10) : 0;
      const nextId = currentMaxId + 1;

      const newSpec = this.specialisationRepository.create({
        id: nextId,
        name: trimmedName,
        status: payload.status,
        education_id: payload.educationId,
        education: { id: payload.educationId } as any,
      });

      await this.specialisationRepository.save(newSpec);
      return {
        message: 'New specialisation category registered successfully',
        status: true,
      };
    }
  }

  /**
   * Hard-deletes an entry row
   */
  async delete_master_data(id: number) {
    const spec = await this.specialisationRepository.findOne({ where: { id } });
    if (!spec) {
      throw new NotFoundException(
        `Specialisation master catalog ID:${id} does not exist`,
      );
    }

    await this.specialisationRepository.delete(spec.id);
    return {
      message: 'Specialisation successfully removed from master registers',
      status: true,
    };
  }
}
