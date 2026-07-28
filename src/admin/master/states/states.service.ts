import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateMasterEntity } from 'src/entities/state_master.entity';
import { Repository, Not } from 'typeorm';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(StateMasterEntity)
    private readonly statesRepository: Repository<StateMasterEntity>,
  ) {}

  //* Get all states by country ID
  async find_all_by_country(countryId: number) {
    return this.statesRepository.find({
      select: {
        id: true,
        name: true,
      },
      where: {
        country: { id: countryId },
      },
      order: { name: 'ASC' },
    });
  }

  // ==========================================================
  // NEW CONFIGURATION PIPELINES
  // ==========================================================

  /**
   * Fetches admin dashboard datasets with relation mappings
   */
  async get_state_master_data(page: number = 1, limit: number = 10) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const [masterData, totalItems] = await this.statesRepository.findAndCount({
      relations: ['country'],
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
    payload: { name: string; status: number; countryId: number },
  ) {
    const trimmedName = payload.name.trim();

    if (id > 0) {
      // Update pipeline
      const state = await this.statesRepository.findOne({ where: { id } });
      if (!state) {
        throw new NotFoundException(`State entry tracking ID:${id} not found`);
      }

      const nameConflict = await this.statesRepository.findOne({
        where: {
          name: trimmedName,
          country: { id: payload.countryId },
          id: Not(id),
        },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A state named '${trimmedName}' already exists in this country`,
        );
      }

      state.name = trimmedName;
      state.status = payload.status;
      state.country = { id: payload.countryId } as any;

      await this.statesRepository.save(state);
      return {
        message: 'State modifications saved successfully',
        status: true,
      };
    } else {
      // Create pipeline
      const nameConflict = await this.statesRepository.findOne({
        where: { name: trimmedName, country: { id: payload.countryId } },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A state named '${trimmedName}' already exists in this country`,
        );
      }

      // Clean, standard TypeORM generation workflow (now completely safe)
      const newState = this.statesRepository.create({
        name: trimmedName,
        status: payload.status,
        country: { id: payload.countryId } as any,
      });

      await this.statesRepository.save(newState);
      return { message: 'New state record created successfully', status: true };
    }
  }

  /**
   * Hard-deletes a state record row
   */
  async delete_master_data(id: number) {
    const state = await this.statesRepository.findOne({ where: { id } });
    if (!state) {
      throw new NotFoundException(
        `State record mapping ID:${id} does not exist`,
      );
    }

    await this.statesRepository.delete(state.id);
    return {
      message: 'State successfully deleted from database records',
      status: true,
    };
  }
}
