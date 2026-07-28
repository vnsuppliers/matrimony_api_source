import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DesignationMasterEntity } from 'src/entities/designation_master.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DesignationMasterService {
  constructor(
    @InjectRepository(DesignationMasterEntity)
    private readonly designationMasterRepository: Repository<DesignationMasterEntity>,
  ) {}

  // get designations by profession_id
  public async get_by_profession_id(profession_id: number) {
    return this.designationMasterRepository.find({
      select: {
        id: true,
        designation_name: true,
      },
      where: {
        profession: { id: profession_id },
      },
      order: {
        designation_name: 'ASC',
      },
    });
  }
}
