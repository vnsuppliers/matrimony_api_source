import { Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileVisitorsService } from './profile_visitors.service';
import { PremiumGuard } from 'src/auth/guards/premium.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

@UseGuards(JwtAuthGuard, PremiumGuard, AccountStatusGuard)
@Controller('profile-visitors')
export class ProfileVisitorsController {
  constructor(private readonly profileService: ProfileVisitorsService) {}

  // Called when someone visits a profile page
  @Post('visit/:id')
  addVisit(@Req() req: any, @Param('id') profileId: string) {
    const viewerId = req.user.id;

    // console.log('viewerId:', viewerId);
    // console.log('profileId:', profileId);
    // console.log('+profileId:', +profileId);

    return this.profileService.addVisit(viewerId, +profileId);
  }

  // Get visitors of the logged-in user's profile
  @Get('visitors')
  getVisitors(@Req() req: any) {
    return this.profileService.getVisitors(req.user.id);
  }

  // Get visitor count of the logged-in user's profile
  @Get('count')
  getVisitorCount(@Req() req: any) {
    return this.profileService.getVisitorCount(req.user.id);
  }
}
