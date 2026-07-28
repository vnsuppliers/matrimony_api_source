import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MatchedProfilesService } from './matched_profiles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PremiumGuard } from 'src/auth/guards/premium.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

interface JwtRequest extends Request {
  user: {
    id: number;
  };
}

@UseGuards(JwtAuthGuard, PremiumGuard, AccountStatusGuard)
@Controller('matched-profiles')
export class MatchedProfilesController {
  constructor(
    private readonly matchedProfilesService: MatchedProfilesService,
  ) {}

  @Get() // ← no :userId param, just GET /matched-profiles
  async getMatchedProfiles(@Req() req: JwtRequest) {
    return this.matchedProfilesService.getMatchedProfiles(req.user.id);
  }
}
