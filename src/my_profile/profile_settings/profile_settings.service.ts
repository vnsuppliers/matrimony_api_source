import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileSettingsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
  ) {}

async get_profile(userId: number) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  const member = await this.memberRepo.findOne({
    where: { user: { id: userId } },
  });
    // Return status along with standard data fields
    return {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      is_online: user?.is_online ?? 0,
      is_verified: user?.is_verified ?? 1,
      account_status_message: user?.account_status_message ?? '',
      profile_image: member?.profile_image
        ? `/api/uploads/profile_pictures/${member.profile_image}`
        : null,
    };
  }

  async update_profile(
    userId: number,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = {
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      is_online: dto.is_online,
    };

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepo.update(userId, updateData);

    if (file?.filename) {
      await this.memberRepo.update(
        { user: { id: userId } },
        { profile_image: file.filename },
      );
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  }
}
