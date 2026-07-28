import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryMasterEntity } from 'src/entities/country_master.entity';
import { Repository, Not } from 'typeorm'; // Cleaned up the import statement here

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(CountryMasterEntity)
    private repo: Repository<CountryMasterEntity>,
  ) {}

  async find_all() {
    return this.repo.find();
  }

  // ==========================================================
  // NEW CONFIGURATION PIPELINES
  // ==========================================================

  /**
   * Fetches admin dashboard datasets using index offsets pagination
   */
  async get_country_master_data(page: number = 1, limit: number = 10) {
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    const [masterData, totalItems] = await this.repo.findAndCount({
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
      // Update existing country record
      const country = await this.repo.findOne({ where: { id } });
      if (!country) {
        throw new NotFoundException(
          `Country entry tracking ID:${id} not found`,
        );
      }

      // Block name conflicts across matching records
      const nameConflict = await this.repo.findOne({
        where: { name: trimmedName, id: Not(id) },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A country named '${trimmedName}' already exists`,
        );
      }

      country.name = trimmedName;
      country.status = payload.status;
      await this.repo.save(country);

      return {
        message: 'Country modifications saved successfully',
        status: true,
      };
    } else {
      // Create new country record
      const nameConflict = await this.repo.findOne({
        where: { name: trimmedName },
      });
      if (nameConflict) {
        throw new ConflictException(
          `A country named '${trimmedName}' already exists`,
        );
      }

      // Manually find the maximum ID in the database to prevent collisions
      const highestRecord = await this.repo.findOne({
        where: {},
        order: { id: 'DESC' },
      });

      const nextId = highestRecord ? highestRecord.id + 1 : 1;

      // Manually pass the clean computed ID into the instantiation layer
      const newCountry = this.repo.create({
        id: nextId, // Force the safe ID manually
        name: trimmedName,
        status: payload.status,
      });

      await this.repo.save(newCountry);

      return {
        message: 'New country record created successfully',
        status: true,
      };
    }
  }

  /**
   * Hard-deletes a row entry from the data store table index mapping
   */
  async delete_master_data(id: number) {
    const country = await this.repo.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(
        `Country record mapping ID:${id} does not exist`,
      );
    }

    await this.repo.delete(country.id);
    return {
      message: 'Country successfully deleted from database records',
      status: true,
    };
  }
}
