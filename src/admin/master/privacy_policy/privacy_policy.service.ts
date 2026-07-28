import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePrivacyPolicyDto } from 'src/dto/create_privacy_policy.dto';
import { PrivacyPolicyEntity } from 'src/entities/privacy_policy.entity';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class PrivacyPolicyService {
  constructor(
    @InjectRepository(PrivacyPolicyEntity)
    private readonly privacyPolicyRepo: Repository<PrivacyPolicyEntity>,
  ) {}

  public async update_create(id: number, payload: CreatePrivacyPolicyDto) {
    let privacyPolicy = null;

    if (id && id > 0) {
      privacyPolicy = await this.privacyPolicyRepo.findOne({
        where: { id: id },
      });
    }

    const data = {
      ...(privacyPolicy ? { id: privacyPolicy.id } : {}), // Fixed from privacyPolicy object to privacyPolicy.id
      name: payload.name,
      icon: payload.icon,
      description: payload.description,
      status: payload.status ?? 1,
    };

    const saved = await this.privacyPolicyRepo.save(data);

    if (!saved) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return {
      status: true,
      message:
        id && id > 0
          ? 'Privacy Policy updated successfully'
          : 'Privacy Policy created successfully',
      data: saved,
    };
  }

  public async getAll(page = 1, search = '') {
    const limit = 10;
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }]
      : {};

    const [record, totalItems] = await this.privacyPolicyRepo.findAndCount({
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
    const result = await this.privacyPolicyRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Target record ID: ${id} not found or already deleted`,
      );
    }
    return {
      status: true,
      message: 'Privacy Policy section removed successfully',
    };
  }

  public async get_active_privacy_policy() {
    const activeData = await this.privacyPolicyRepo.find({
      where: { status: 1 },
      order: { id: 'ASC' },
    });

    return {
      status: true,
      message: 'Privacy Policy fetched successfully',
      records: activeData,
    };
  }
}
