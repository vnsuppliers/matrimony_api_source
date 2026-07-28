import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { MembersListService } from './members_list.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PremiumGuard } from 'src/auth/guards/premium.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

interface JwtRequest extends Request {
  user: {
    id: number;
  };
}

@UseGuards(JwtAuthGuard, PremiumGuard, AccountStatusGuard)
@Controller('members-list')
export class MembersListController {
  constructor(private readonly membersService: MembersListService) {}

  @Get('profiles')
  async getProfiles(@Req() req: JwtRequest) {
    return await this.membersService.get_profiles(req.user.id);
  }

  @Get(':id')
  async getProfileById(@Param('id') id: number) {
    return await this.membersService.getProfileById(id);
  }
}
