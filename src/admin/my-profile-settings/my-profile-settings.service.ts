import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminProfileSettingsDto } from 'src/dto/admin_profile_settings.dto';
import { MemberEntity } from 'src/entities/member.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MyProfileSettingsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,
  ) {}

  public async get_my_profile(user_id: number) {
    const parsedId = Number(user_id);

    const user = await this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.members', 'm')
      .where('u.id = :user_id', {
        user_id: isNaN(parsedId) ? user_id : parsedId,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(`The user with ID:${user_id} not exists`);
    }

    const member = user.members?.[0];

    return {
      id: user.id,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      is_online: user.is_online || 0,
      role_id: user.role_id,
      profile_image: member?.profile_image
        ? `/api/uploads/profile_pictures/${member.profile_image}`
        : null,
      user: {
        ...user,
        members: (user.members || []).map((m) => ({
          ...m,
          profile_image: m.profile_image
            ? `/api/uploads/profile_pictures/${m.profile_image}`
            : null,
        })),
      },
    };
  }

  public async updateCreate(
    user_id: number,
    payload: AdminProfileSettingsDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`The user with ID: ${user_id} not found`);
    }

    const updateData: any = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
    };

    // Explicitly hash and add password if provided and not empty
    if (payload.password && payload.password.trim() !== '') {
      updateData.password = await bcrypt.hash(payload.password, 10);
    }

    await this.userRepo.update(user_id, updateData);

    if (file?.filename) {
      const existingMember = await this.memberRepo.findOne({
        where: { user: { id: user_id } },
      });

      if (existingMember) {
        await this.memberRepo.update(
          { user: { id: user_id } },
          { profile_image: file.filename },
        );
      } else {
        const newMember = this.memberRepo.create({
          user: { id: user_id } as any,
          profile_image: file.filename,
        });
        await this.memberRepo.save(newMember);
      }
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  }
}
