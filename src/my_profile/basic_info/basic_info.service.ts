import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MemberEntity } from 'src/entities/member.entity';
import { User } from 'src/entities/user.entity';
import { BasicInfoDto } from 'src/dto/basic_info.dto';

@Injectable()
export class BasicInfoService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // GET
  public async get_basic_info(user_id: number) {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user)
      throw new NotFoundException('User account configuration entry not found');

    const data = await this.memberRepo
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .where('member.user_id = :user_id', { user_id })
      .getOne();

    if (!data) return null;

    if (data.profile_image) {
      data.profile_image = `/api/uploads/profile_pictures/${data.profile_image}`;
    }

    return data;
  }

  // UPDATE / CREATE
  public async update_create_basic_info(user_id: number, dto: BasicInfoDto) {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User account record missing');

    // Update user table parameters
    await this.userRepo.update(user_id, {
      first_name: dto.first_name,
      last_name: dto.last_name,
      is_online: dto.is_online,
    });

    let member = await this.memberRepo.findOne({ where: { user_id } });

    if (!member) {
      member = this.memberRepo.create({
        user_id,
        gender_id: dto.gender_id,
        date_of_birth: dto.date_of_birth,
        about: dto.about,
      });

      await this.memberRepo.save(member);
      return { message: 'Basic info created successfully' };
    }

    await this.memberRepo.update(
      { user_id },
      {
        gender_id: dto.gender_id,
        date_of_birth: dto.date_of_birth,
        about: dto.about,
      },
    );

    return { message: 'Basic info updated successfully' };
  }
}
