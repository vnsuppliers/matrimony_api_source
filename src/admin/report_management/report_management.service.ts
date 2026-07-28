import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportProfilesEntity } from 'src/entities/report_profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportManagementService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ReportProfilesEntity)
    private readonly reportProfileRepo: Repository<ReportProfilesEntity>,
  ) {}

  public async get_reoprted_profiles() {
    const record = await this.reportProfileRepo
      .createQueryBuilder('report')
      // 1. Join reporter user account to obtain their name metadata
      .leftJoinAndSelect('report.reporter', 'reporter')

      // 2. Join reporter member table profile data to safely extract their profile image
      .leftJoinAndSelect('reporter.members', 'reporterMember')

      // 3. Join the reported user account to obtain their name metadata
      .leftJoinAndSelect('report.reportedUser', 'reportedUser')

      // 4. Join the reported user member table profile data to safely extract their profile image
      .leftJoinAndSelect('reportedUser.members', 'reportedUserMember')

      .orderBy('report.id', 'DESC')
      .getMany();

    if (!record || record.length === 0) {
      throw new NotFoundException('No reports exist');
    }

    // Format the image paths using your environment variable setup
    const formattedRecords = record.map((item) => ({
      ...item,
      reporter: item.reporter
        ? {
            ...item.reporter,
            members: (item.reporter.members || []).map((m) => ({
              ...m,
              profile_image: m.profile_image
                ? `/api/uploads/profile_pictures/${m.profile_image}`
                : null,
            })),
          }
        : null,
      reportedUser: item.reportedUser
        ? {
            ...item.reportedUser,
            members: (item.reportedUser.members || []).map((m) => ({
              ...m,
              profile_image: m.profile_image
                ? `/api/uploads/profile_pictures/${m.profile_image}`
                : null,
            })),
          }
        : null,
    }));

    return { record: formattedRecords };
  }

  // Save the admin note and the exact disciplinary action taken
  public async resolve_report(
    id: number,
    action_taken: string,
    admin_note: string,
  ) {
    const report = await this.reportProfileRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report instance with ID #${id} not found`);
    }

    report.status = 'resolved';
    report.action_taken = action_taken;
    report.admin_note = admin_note;

    await this.reportProfileRepo.save(report);
    return {
      success: true,
      message: 'Case committed and archived successfully',
    };
  }

  // Dismiss the report completely
  public async dismiss_report(id: number) {
    const report = await this.reportProfileRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report instance with ID #${id} not found`);
    }

    report.status = 'dismissed';
    await this.reportProfileRepo.save(report);
    return { success: true, message: 'Case dismissed successfully' };
  }
}
