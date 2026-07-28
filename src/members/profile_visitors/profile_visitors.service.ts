import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileVisitEntity } from 'src/entities/profile_visttors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileVisitorsService {
  constructor(
    @InjectRepository(ProfileVisitEntity)
    private readonly visitRepo: Repository<ProfileVisitEntity>,
  ) {}
  async addVisit(viewerId: number, profileId: number) {
    if (viewerId === profileId) return;

    const visit = this.visitRepo.create({
      viewer_id: viewerId,
      profile_id: profileId,
    });

    await this.visitRepo.save(visit);
  }
  async getVisitors(profileId: number) {
    const visits = await this.visitRepo.find({
      where: { profile_id: profileId },
      relations: ['viewer'],
      order: { created_at: 'DESC' },
    });

    // Group by viewer_id
    const grouped = new Map<
      number,
      { viewer: any; visits: any[]; count: number }
    >();

    for (const visit of visits) {
      const vid = visit.viewer_id;
      if (!grouped.has(vid)) {
        grouped.set(vid, { viewer: visit.viewer, visits: [], count: 0 });
      }
      const entry = grouped.get(vid)!;
      entry.visits.push({ id: visit.id, visited_at: visit.created_at });
      entry.count++;
    }

    return Array.from(grouped.values()).map((g) => ({
      viewer: g.viewer,
      visit_count: g.count,
      last_visited: g.visits[0]?.visited_at,
      visit_history: g.visits,
    }));
  }

  async getVisitorCount(profileId: number) {
    // unique visitors count
    const result = await this.visitRepo
      .createQueryBuilder('v')
      .select('COUNT(DISTINCT v.viewer_id)', 'count')
      .where('v.profile_id = :profileId', { profileId })
      .getRawOne();

    return { count: Number(result.count) };
  }
}
