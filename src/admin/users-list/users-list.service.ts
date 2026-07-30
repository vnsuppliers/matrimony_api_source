import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersListService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public async get_all_users() {
    const users = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.members', 'm')
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.phone',
        'user.is_verified',
        'user.is_premium',
        'user.created_at',
        'm.id',
        'm.gender_id',
        'm.profile_image',
      ])
      .where('user.role_id != :role_id', { role_id: 1 })
      .getMany();

    const formattedUsers = users.map((user) => ({
      ...user,
      verification_status: user.is_verified === 1 ? 'Verified' : 'Unverified',
      premium_status: user.is_premium === 1 ? 'Premium' : 'Not Premium',
      members: user.members.map((member) => ({
        id: member.id,
        gender:
          member.gender_id === 1
            ? 'Male'
            : member.gender_id === 2
              ? 'Female'
              : 'Other',
        profile_image: member.profile_image
          ? `/api/uploads/profile_pictures/${member.profile_image}`
          : null,
      })),
    }));
    // console.log(JSON.stringify({ users: formattedUsers }, null, 2));
    return { users: formattedUsers };
  }

  public async get_profile_by_id(userId: number) {
    const profile = await this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.members', 'm')
      .leftJoinAndSelect('m.motherTongue', 'motherTongue')
      .leftJoinAndSelect('m.religion_master', 'religion_master')
      .leftJoinAndSelect('u.physical_attributes', 'physical_attributes')
      .leftJoinAndSelect('u.astro', 'astro')
      .leftJoinAndSelect('u.familyInfo', 'familyInfo')
      .leftJoinAndSelect('familyInfo.countrymaster', 'familyCountry')
      .leftJoinAndSelect('familyInfo.statemaster', 'familyState')
      .leftJoinAndSelect('familyInfo.citymaster', 'familyCity')
      .leftJoinAndSelect('u.hobbies_info', 'hobbies_info')
      .leftJoinAndSelect('u.lifestyleInfo', 'lifestyleInfo')
      .leftJoinAndSelect('u.relative_info', 'relative_info')
      .leftJoinAndSelect('u.siblings_info', 'siblings_info')
      .leftJoinAndSelect('siblings_info.countrymaster', 'siblingCountry')
      .leftJoinAndSelect('siblings_info.statemaster', 'siblingState')
      .leftJoinAndSelect('siblings_info.citymaster', 'siblingCity')
      .leftJoinAndSelect('u.permanent_address', 'permanent_address')
      .leftJoinAndSelect('permanent_address.countrymaster', 'permCountry')
      .leftJoinAndSelect('permanent_address.statemaster', 'permState')
      .leftJoinAndSelect('permanent_address.citymaster', 'permCity')
      .leftJoinAndSelect('u.present_address', 'present_address')
      .leftJoinAndSelect('present_address.countrymaster', 'presCountry')
      .leftJoinAndSelect('present_address.statemaster', 'presState')
      .leftJoinAndSelect('present_address.citymaster', 'presCity')
      .leftJoinAndSelect('u.education_info', 'education_info')
      .leftJoinAndSelect('education_info.edumaster', 'edumaster')
      .leftJoinAndSelect('education_info.countryMaster', 'eduCountry')
      .leftJoinAndSelect('education_info.statemaster', 'eduState')
      .leftJoinAndSelect('education_info.citymaster', 'eduCity')
      .leftJoinAndSelect('education_info.specialmaster', 'specialmaster')
      .leftJoinAndSelect('u.professionInfos', 'professionInfos')
      .leftJoinAndSelect('professionInfos.profession', 'profession')
      .leftJoinAndSelect('professionInfos.designation', 'designation')
      .leftJoinAndSelect('professionInfos.country', 'country')
      .leftJoinAndSelect('professionInfos.state', 'state')
      .leftJoinAndSelect('professionInfos.city', 'city')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${userId} does not exist`);
    }

    const formattedProfile = {
      ...profile,
      members: profile.members.map((member) => ({
        ...member,
        profile_image: member.profile_image
          ? `/api/uploads/profile_pictures/${member.profile_image}`
          : null,
      })),
    };
    // console.log(profile);
    return { profile: formattedProfile };
  }
}
