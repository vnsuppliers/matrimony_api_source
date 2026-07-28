import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReligionMasterEntity } from 'src/entities/religion_master.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReligionService {
  constructor(
    @InjectRepository(ReligionMasterEntity)
    private readonly religionRepository: Repository<ReligionMasterEntity>,
  ) {}

  public async get_all() {
    const religion = await this.religionRepository.find({
      where: { status: 1 },
    });
    return religion;
  }
}
