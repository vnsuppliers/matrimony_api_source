import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MemberEntity } from 'src/entities/member.entity';
import { ReligiousInfoDto } from 'src/dto/religious_info.dto';

@Injectable()
export class ReligiousInfoService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
  ) {}

  // ---------------- GET ----------------
  public async get_religious_info(user_id: number) {
    if (!user_id || isNaN(user_id)) {
      throw new BadRequestException('Invalid user id');
    }

    const data = await this.memberRepo
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.user_id = :user_id', { user_id })
      .getOne();

    // 🛠️ SAFE FALLBACK: If member record is missing entirely, return a shell layout
    // so frontend fields don't run into undefined object access properties.
    if (!data) {
      return {
        user_id,
        religion_id: null,
        caste: null,
        sub_caste: null,
        mother_tongue_id: null,
      };
    }

    return data;
  }

  // ---------------- SAFE CONVERTER ----------------
  private toNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  // ---------------- UPDATE / CREATE ----------------
  public async update_create_religious_info(
    user_id: number,
    dto: ReligiousInfoDto,
  ) {
    const payload = {
      user_id,
      religion_id: this.toNumber(dto.religion_id),
      caste: dto.caste ?? null,
      sub_caste: dto.sub_caste ?? null,
      mother_tongue_id: this.toNumber(dto.mother_tongue_id),
    };

    // 1. check member exists
    let member = await this.memberRepo.findOne({
      where: { user_id },
    });

    // 2. CREATE
    if (!member) {
      member = this.memberRepo.create(payload);
      await this.memberRepo.save(member);

      return { message: 'Religious info created successfully' };
    }

    // 3. UPDATE
    await this.memberRepo.update({ user_id }, payload);

    return { message: 'Religious info updated successfully' };
  }
}
