import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { BlockProfileEntity } from 'src/entities/block_profile.entity';

@Injectable()
export class MembersListService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,

    @InjectRepository(BlockProfileEntity)
    private readonly blockProfile: Repository<BlockProfileEntity>,
  ) {}

  public async get_profiles(userId: number) {
    // Fetch logged-in user details
    const loggedInUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['members'],
    });

    if (!loggedInUser) {
      throw new NotFoundException('User not found');
    }

    const member = loggedInUser.members?.[0];
    if (!member) {
      throw new NotFoundException('Member profile not found');
    }

    // Add enforcement condition: Target profiles MUST have user.is_verified === 1
    const whereCondition: FindOptionsWhere<MemberEntity> = {
      user_id: Not(userId),
      user: {
        is_verified: 1,
      },
    };

    // Gender matching logic
    if (Number(member.gender_id) === 1) {
      whereCondition.gender_id = 2;
    } else if (Number(member.gender_id) === 2) {
      whereCondition.gender_id = 1;
    }

    const profiles = await this.memberRepo.find({
      where: whereCondition,
      relations: [
        'user',
        'user.members',
        'motherTongue',
        'religion_master',
        'user.physical_attributes',
        'user.present_address',
        'user.education_info',
        'user.professionInfos',
      ],
    });

    return profiles.map((p) => {
      const memberData = p.user?.members?.[0];
      return {
        ...p,
        user: {
          ...p.user,
          member: {
            ...memberData,
            profile_image: memberData?.profile_image
              ? `/api/uploads/profile_pictures/${memberData.profile_image}`
              : null,
          },
        },
      };
    });
  }

  public async getProfileById(userId: number) {
    const profile = await this.memberRepo.findOne({
      where: {
        user_id: userId,
        user: { is_verified: 1 }, // Block querying individual unverified profiles
      },
      relations: [
        'user',
        'user.members',
        'motherTongue',
        'religion_master',
        'user.physical_attributes',
        'user.astro',
        'user.familyInfo',
        'user.familyInfo.countrymaster',
        'user.familyInfo.statemaster',
        'user.familyInfo.citymaster',
        'user.hobbies_info',
        'user.lifestyleInfo',
        'user.relative_info',
        'user.siblings_info',
        'user.permanent_address',
        'user.permanent_address.countrymaster',
        'user.permanent_address.statemaster',
        'user.permanent_address.citymaster',
        'user.present_address',
        'user.present_address.countrymaster',
        'user.present_address.statemaster',
        'user.present_address.citymaster',
        'user.education_info',
        'user.education_info.edumaster',
        'user.education_info.countryMaster',
        'user.education_info.statemaster',
        'user.education_info.citymaster',
        'user.education_info.specialmaster',
        'user.professionInfos',
        'user.professionInfos.profession',
        'user.professionInfos.designation',
      ],
    });

    if (!profile) {
      throw new NotFoundException(
        'Profile not found or is currently unavailable.',
      );
    }

    const memberData = profile.user?.members?.[0];

    return {
      ...profile,
      user: {
        ...profile.user,
        member: {
          ...memberData,
          profile_image: memberData?.profile_image
            ? `/api/uploads/profile_pictures/${memberData.profile_image}`
            : null,
        },
      },
    };
  }
}
