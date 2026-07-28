import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTermsConditionsDto } from 'src/dto/create-terms-conditions.dto';
import { TermsConditionsEntity } from 'src/entities/terms_conditions.entity';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class TermsConditionsService {
  constructor(
    @InjectRepository(TermsConditionsEntity)
    private readonly termsConditionsRepo: Repository<TermsConditionsEntity>,
  ) {}

  public async updateCreate(id: number, payload: CreateTermsConditionsDto) {
    let termsconditions = null;

    if (id && id > 0) {
      termsconditions = await this.termsConditionsRepo.findOne({
        where: { id: id },
      });
    }

    const data = {
      ...(termsconditions ? { id: termsconditions.id } : {}),
      name: payload.name,
      description: payload.description,
      icon: payload.icon,
      status: payload.status ?? 1,
    };

    const saved = await this.termsConditionsRepo.save(data);

    if (!saved) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return {
      status: true,
      message:
        id && id > 0
          ? 'Terms & Conditions updated successfully'
          : 'Terms & Conditions created successfully',
      data: saved,
    };
  }

  public async get_terms_conditions(page = 1, search = '') {
    const limit = 10;
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }]
      : {};

    const [record, totalItems] = await this.termsConditionsRepo.findAndCount({
      where: whereCondition,
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });

    return {
      status: true,
      record,
      meta: {
        totalItems,
        itemCount: record.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit) || 1,
        currentPage: page,
      },
    };
  }

  public async remove(id: number) {
    const result = await this.termsConditionsRepo.delete(id);
    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Target record ID: ${id} not found or already deleted`,
      );
    }
    return {
      status: true,
      message: 'Terms & Conditions section removed successfully',
    };
  }

  /**
   * Get acive terms & conditions.
   */
  public async get_active_terms_conditions() {
    const activeData = await this.termsConditionsRepo.find({
      where: { status: 1 },
      order: { id: 'ASC' },
    });

    if(!activeData) {
      throw new NotFoundException('Terms & Conditions are not found');
    }
    // console.log(activeData);
    return {
      status: true,
      message: 'Terms & Conditions fetched successfully',
      records: activeData,
    };

  }

}
