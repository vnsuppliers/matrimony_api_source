import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, FindOptionsWhere } from 'typeorm';
import { MemberEntity } from '../../entities/member.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class MatchedProfilesService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getMatchedProfiles(userId: number) {
    // 1. Load logged-in user's MEMBER details
    const myMember = await this.memberRepo.findOne({
      where: { user_id: userId },
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

    if (!myMember) {
      throw new NotFoundException('Member profile not found');
    }

    // 2. Query adjustments: Only fetch candidates who are actively verified (is_verified === 1)
    const whereCondition: FindOptionsWhere<MemberEntity> = {
      user_id: Not(userId),
      user: {
        is_verified: 1, // Filter out unverified/suspended candidates from global pool
      },
    };

    // Gender matching
    if (Number(myMember.gender_id) === 1) {
      whereCondition.gender_id = 2;
    } else if (Number(myMember.gender_id) === 2) {
      whereCondition.gender_id = 1;
    }

    const candidates = await this.memberRepo.find({
      where: whereCondition,
      relations: [
        'user',
        'motherTongue',
        'user.members',
        'religion_master',
        'user.physical_attributes',
        'user.present_address',
        'user.education_info',
        'user.professionInfos',
      ],
    });

    // Score and sort
    const scoredProfiles = candidates.map((candidate) => {
      const memberData = candidate.user?.members?.[0];
      const matchScore = this.calculateMatchScore(myMember, candidate);

      return {
        ...candidate,
        matchScore,
        user: {
          ...candidate.user,
          member: {
            ...memberData,
            profile_image: memberData?.profile_image
              ? `/api/uploads/profile_pictures/${memberData.profile_image}`
              : null,
          },
        },
      };
    });

    return scoredProfiles.sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateMatchScore(
    me: MemberEntity,
    candidate: MemberEntity,
  ): number {
    let score = 0;

    // Religion match — 25 pts
    if (
      me.religion_id &&
      candidate.religion_id &&
      Number(me.religion_id) === Number(candidate.religion_id)
    ) {
      score += 25;
    }

    // Mother tongue match — 15 pts
    if (
      me.mother_tongue_id &&
      candidate.mother_tongue_id &&
      Number(me.mother_tongue_id) === Number(candidate.mother_tongue_id)
    ) {
      score += 15;
    }

    // City match — 20 pts
    const myCity = me.user?.present_address?.city_id;
    const candidateCity = candidate.user?.present_address?.city_id;
    if (myCity && candidateCity && Number(myCity) === Number(candidateCity)) {
      score += 20;
    }

    // Education match — 20 pts
    const myEdu = me.user?.education_info?.sort((a, b) => b.id - a.id)?.[0];
    const candidateEdu = candidate.user?.education_info?.sort(
      (a, b) => b.id - a.id,
    )?.[0];
    if (
      myEdu?.education_id &&
      candidateEdu?.education_id &&
      Number(myEdu.education_id) === Number(candidateEdu.education_id)
    ) {
      score += 20;
    }

    // Specialisation match — 10 pts
    if (
      myEdu?.specialisation_id &&
      candidateEdu?.specialisation_id &&
      Number(myEdu.specialisation_id) === Number(candidateEdu.specialisation_id)
    ) {
      score += 10;
    }

    // Profession match — 20 pts
    const myProf = me.user?.professionInfos?.sort((a, b) => b.id - a.id)?.[0];
    const candidateProf = candidate.user?.professionInfos?.sort(
      (a, b) => b.id - a.id,
    )?.[0];
    if (
      myProf?.profession_id &&
      candidateProf?.profession_id &&
      Number(myProf.profession_id) === Number(candidateProf.profession_id)
    ) {
      score += 20;
    }

    // Designation match — 10 pts
    if (
      myProf?.designation_id &&
      candidateProf?.designation_id &&
      Number(myProf.designation_id) === Number(candidateProf.designation_id)
    ) {
      score += 10;
    }

    return score;
  }
}
