import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityMasterEntity } from 'src/entities/city_master.entity';
import { Repository, Not } from 'typeorm';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityMasterEntity)
    private readonly citiesRepository: Repository<CityMasterEntity>,
  ) {}

  async find_by_state(stateId: number) {
    const cities = await this.citiesRepository.find({
      select: ['id', 'name'],
      where: {
        state: { id: stateId },
      },
      order: { name: 'ASC' },
    });

    return cities.map((c) => ({
      id: c.id,
      name: c.name,
    }));
  }

  // ==========================================================
  // NEW CONFIGURATION PIPELINES
  // ==========================================================

  /**
   * Fetches paginated table layout grids for city registers
   */
  async get_city_master_data(page: number = 1, limit: number = 10) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    // Resolves deep multi-level database relations (City -> State -> Country)
    const [masterData, totalItems] = await this.citiesRepository.findAndCount({
      relations: ['state', 'state.country'],
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
  async update_create(id: number, payload: { name: string; stateId: number }) {
    const trimmedName = payload.name.trim();

    if (id > 0) {
      // Update pipeline
      const city = await this.citiesRepository.findOne({ where: { id } });
      if (!city) {
        throw new NotFoundException(`City record mapping ID:${id} not found`);
      }

      const nameConflict = await this.citiesRepository.findOne({
        where: {
          name: trimmedName,
          state: { id: payload.stateId },
          id: Not(id),
        },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A city named '${trimmedName}' already exists in this state`,
        );
      }

      city.name = trimmedName;
      city.state = { id: payload.stateId } as any;

      await this.citiesRepository.save(city);
      return { message: 'City modifications saved successfully', status: true };
    } else {
      // Create pipeline
      const nameConflict = await this.citiesRepository.findOne({
        where: { name: trimmedName, state: { id: payload.stateId } },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A city named '${trimmedName}' already exists in this state`,
        );
      }

      // Safe Auto-Increment Key Mismatch bypass query handler
      const result = await this.citiesRepository
        .createQueryBuilder('city')
        .select('MAX(city.id)', 'maxId')
        .getRawOne();
      const currentMaxId = result?.maxId ? parseInt(result.maxId, 10) : 0;
      const nextId = currentMaxId + 1;

      const newCity = this.citiesRepository.create({
        id: nextId,
        name: trimmedName,
        state: { id: payload.stateId } as any,
      });

      await this.citiesRepository.save(newCity);
      return { message: 'New city record created successfully', status: true };
    }
  }

  /**
   * Hard-deletes a city entry row
   */
  async delete_master_data(id: number) {
    const city = await this.citiesRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException(
        `City record mapping ID:${id} does not exist`,
      );
    }

    await this.citiesRepository.delete(city.id);
    return {
      message: 'City successfully deleted from database records',
      status: true,
    };
  }
}
