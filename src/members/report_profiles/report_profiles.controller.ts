import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReportProfilesService } from './report_profiles.service';
import { ReportProfileDto } from '../../dto/report_profile.dto';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

interface JwtRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@UseGuards(JwtAuthGuard, AccountStatusGuard)
@Controller('report-profiles')
export class ReportProfilesController {
  constructor(private readonly service: ReportProfilesService) {}

  // submit report
  @Post()
  create(@Req() req: JwtRequest, @Body() dto: ReportProfileDto) {
    return this.service.createReport(req.user.id, dto);
  }

  // (optional admin use)
  @Get()
  getAll() {
    return this.service.getAllReports();
  }

  @Get('status/:reportedUserId')
  checkStatus(@Req() req: JwtRequest, @Param('reportedUserId') id: number) {
    return this.service.checkIfReported(req.user.id, Number(id));
  }

  @Get('my-reports')
  async getMyReports(@Req() req: JwtRequest) {
    return this.service.getSubmittedReports(req.user.id);
  }

  @Get('received-reports')
  getReceivedReports(@Req() req: JwtRequest) {
    return this.service.getReceivedReports(req.user.id);
  }
}
