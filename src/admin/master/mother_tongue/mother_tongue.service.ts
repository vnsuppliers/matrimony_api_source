import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MotherTongueMasterEntity } from 'src/entities/mother_tongue_master.entity';
import { CreateMotherTongueDto } from 'src/dto/mother_tongue_master.dto';

@Injectable()
export class MotherTongueService {
  constructor(
    @InjectRepository(MotherTongueMasterEntity)
    private readonly motherTongueRepository: Repository<MotherTongueMasterEntity>,
  ) {}

  public async get_all_mother_tongues() {
    const mother_tongue = await this.motherTongueRepository.find({
      where: { status: 1 },
    });
    return mother_tongue;
  }

  // get master data.
  // Get master data with pagination (10 records per page by default)
  public async get_master_data(page: number = 1, limit: number = 10) {
    // Ensure numbers are clean and valid numbers
    const currentPage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const skipAmount = (currentPage - 1) * safeLimit;

    // findAndCount returns an array: [dataItems, totalCount]
    const [masterData, totalItems] =
      await this.motherTongueRepository.findAndCount({
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
        message: 'No master data exists',
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
   * Upsert Service Engine Handler: Updates a record if a valid target ID exists,
   * otherwise checks for duplicate uniqueness keys and inserts a new master record row entity.
   */
  public async update_create_master_data(
    id: number,
    payload: CreateMotherTongueDto,
  ) {
    // If an ID greater than 0 is provided, check if the record exists to update it
    if (id && id > 0) {
      const existingData = await this.motherTongueRepository.findOne({
        where: { id },
      });
      if (!existingData) {
        throw new NotFoundException(
          `Mother tongue ID: ${id} not found for updates`,
        );
      }

      // Check unique name constraint before saving modification changes to prevent crashes
      if (payload.name && payload.name !== existingData.name) {
        const nameDuplicate = await this.motherTongueRepository.findOne({
          where: { name: payload.name },
        });
        if (nameDuplicate) {
          throw new ConflictException(
            `A language with the name '${payload.name}' already exists`,
          );
        }
      }

      // Merge dynamic modification updates safely
      this.motherTongueRepository.merge(existingData, payload);
      const updatedRecord =
        await this.motherTongueRepository.save(existingData);

      return {
        message: 'Mother tongue registry updated successfully',
        data: updatedRecord,
      };
    }

    // Fallback execution branch: If ID is null, 0, or missing, handle it as a completely new entry creation operation
    const nameDuplicate = await this.motherTongueRepository.findOne({
      where: { name: payload.name },
    });
    if (nameDuplicate) {
      throw new ConflictException(
        `A language named '${payload.name}' has already been registered`,
      );
    }

    const newEntity = this.motherTongueRepository.create(payload);
    const savedRecord = await this.motherTongueRepository.save(newEntity);

    return {
      message: 'New mother tongue added successfully.',
      data: savedRecord,
    };
  }

  // Delete Master data.
  public async delete_master_data(id: number) {
    const masterData = await this.motherTongueRepository.findOne({
      where: { id: id },
    });

    if (!masterData) {
      throw new NotFoundException(`Mother tongue ID:${id} not exists`);
    }

    // Added await here to ensure the deletion finishes before returning execution response
    await this.motherTongueRepository.delete(masterData.id);

    return {
      message: 'Mother tongue deleted successfully',
      status: true,
    };
  }
}
