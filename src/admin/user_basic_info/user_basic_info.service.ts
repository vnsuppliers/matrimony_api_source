import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { Repository } from 'typeorm';

export interface UpdateBasicProfileDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  about?: string;
  caste?: string;
  sub_caste?: string;
  date_of_birth?: string;
  religion_id?: number;
  mother_tongue_id?: number;
}

@Injectable()
export class UserBasicInfoService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
  ) {}

  async update_create(
    userId: number,
    dto: UpdateBasicProfileDto,
    file?: Express.Multer.File,
  ) {
    // Verify that the core user exists before doing anything
    const userExists = await this.userRepo.findOne({ where: { id: userId } });
    if (!userExists) {
      throw new NotFoundException('User account not found');
    }

    //  Always update the user base details
    await this.userRepo.update(userId, {
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
    });

    // Look up the existing member entity
    let member = await this.memberRepo.findOne({
      where: {
        user_id: userId,
      },
    });

    let isNewRecord = false;

    // If no member record is found, instantiate a new record
    if (!member) {
      isNewRecord = true;
      member = this.memberRepo.create({
        user_id: userId, // Link it to the user identity
      });
    }

    // Update/Assign profile parameters
    member.about = dto.about;
    member.caste = dto.caste;
    member.sub_caste = dto.sub_caste;
    member.religion_id = dto.religion_id ? Number(dto.religion_id) : null;
    member.mother_tongue_id = dto.mother_tongue_id
      ? Number(dto.mother_tongue_id)
      : null;
    member.date_of_birth = dto.date_of_birth
      ? new Date(dto.date_of_birth)
      : null;

    if (file) {
      member.profile_image = file.filename;
    }

    //  Save records (TypeORM `.save()` automatically performs an INSERT if no primary key matches, otherwise an UPDATE)
    await this.memberRepo.save(member);

    return {
      success: true,
      message: isNewRecord
        ? 'Profile details created successfully'
        : 'Profile details updated successfully',
    };
  }
}
