import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReportManagementService } from './report_management.service';

@UseGuards(JwtAuthGuard)
@Controller('report-management')
export class ReportManagementController {
  constructor(private readonly reportProfileService: ReportManagementService) {}

  // Fetches all incidents with nested account names and formatted profile images
  @Get('/get-reported-profiles')
  async get_report_profiles() {
    return this.reportProfileService.get_reoprted_profiles();
  }

  // Receives the action_taken and admin_note string payloads from the modal to close the case
  @Patch('/:id/resolve')
  async resolve_profile_report(
    @Param('id') id: number,
    @Body() body: { action_taken: string; admin_note: string },
  ) {
    return this.reportProfileService.resolve_report(
      id,
      body.action_taken,
      body.admin_note,
    );
  }

  // Updates the targeted report record status value directly to dismissed
  @Patch('/:id/dismiss')
  async dismiss_profile_report(@Param('id') id: number) {
    return this.reportProfileService.dismiss_report(id);
  }
}
