import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { EducationMasterEntity } from 'src/entities/education_master.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationMasterEntity)
    private readonly educationRepository: Repository<EducationMasterEntity>,
  ) {}
  
  public async get_education() {
    const education = await this.educationRepository.find({
      where: {
        status: 1,
      },
      order: {
        id: 'ASC',
      },
    });

    return education;
  }

  // ==========================================================
  // NEW CONFIGURATION PIPELINES
  // ==========================================================

  /**
   * Fetches admin dashboard grid datasets using index page offsets
   */
  async get_education_master_data(page: number = 1, limit: number = 10) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const [masterData, totalItems] =
      await this.educationRepository.findAndCount({
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
  async update_create(id: number, payload: { name: string; status: number }) {
    const trimmedName = payload.name.trim();

    if (id > 0) {
      // Update pipeline
      const education = await this.educationRepository.findOne({
        where: { id },
      });
      if (!education) {
        throw new NotFoundException(
          `Education registry item tracking ID:${id} not found`,
        );
      }

      const nameConflict = await this.educationRepository.findOne({
        where: { name: trimmedName, id: Not(id) },
      });
      if (nameConflict) {
        throw new ConflictException(
          `An education level named '${trimmedName}' already exists`,
        );
      }

      education.name = trimmedName;
      education.status = payload.status;
      await this.educationRepository.save(education);

      return {
        message: 'Education alterations saved successfully',
        status: true,
      };
    } else {
      // Create pipeline
      const nameConflict = await this.educationRepository.findOne({
        where: { name: trimmedName },
      });
      if (nameConflict) {
        throw new ConflictException(
          `An education level named '${trimmedName}' already exists`,
        );
      }

      // Safe primary key counter synchronization mapping lookup
      const result = await this.educationRepository
        .createQueryBuilder('edu')
        .select('MAX(edu.id)', 'maxId')
        .getRawOne();
      const currentMaxId = result?.maxId ? parseInt(result.maxId, 10) : 0;
      const nextId = currentMaxId + 1;

      const newEducation = this.educationRepository.create({
        id: nextId,
        name: trimmedName,
        status: payload.status,
      });

      await this.educationRepository.save(newEducation);
      return {
        message: 'New education category registered successfully',
        status: true,
      };
    }
  }

  /**
   * Hard-deletes a row entry out of the database data store
   */
  async delete_master_data(id: number) {
    const education = await this.educationRepository.findOne({ where: { id } });
    if (!education) {
      throw new NotFoundException(
        `Education master catalog ID:${id} does not exist`,
      );
    }

    await this.educationRepository.delete(education.id);
    return {
      message: 'Education row successfully cleared from master indexes',
      status: true,
    };
  }
}
