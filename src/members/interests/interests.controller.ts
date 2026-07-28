import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InterestsService } from './interests.service';
import { RejectInterestDto } from 'src/dto/reject_interest.dto';
import { PremiumGuard } from 'src/auth/guards/premium.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

interface JwtRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@UseGuards(JwtAuthGuard, PremiumGuard, AccountStatusGuard)
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  // Send Interest
  @Post('add/:interested_to')
  async add(
    @Req() req: JwtRequest,
    @Param('interested_to') interested_to: string,
  ) {
    return this.interestsService.addInterest(
      req.user.id,
      parseInt(interested_to),
    );
  }

  // Remove Interest
  @Delete('remove/:interested_to')
  async remove(
    @Req() req: JwtRequest,
    @Param('interested_to') interested_to: string,
  ) {
    return this.interestsService.removeInterest(
      req.user.id,
      parseInt(interested_to),
    );
  }

  // My Sent Interests
  @Get()
  async list(@Req() req: JwtRequest) {
    return this.interestsService.getInterests(req.user.id);
  }

  // Received Interests
  @Get('received')
  async received(@Req() req: JwtRequest) {
    return this.interestsService.getReceivedInterests(req.user.id);
  }

  // Accept Interest
  @Post('accept/:interestId')
  async accept(
    @Req() req: JwtRequest,
    @Param('interestId') interestId: string,
  ) {
    return this.interestsService.acceptInterest(
      req.user.id,
      parseInt(interestId),
    );
  }

  // Reject Interest
  @Post('reject/:interestId')
  async reject(
    @Req() req: JwtRequest,
    @Param('interestId') interestId: string,
    @Body() dto: RejectInterestDto,
  ) {
    return this.interestsService.rejectInterest(
      req.user.id,
      parseInt(interestId),
      dto.reason,
    );
  }

  @Get('rejected')
  async getRejected(
    @Req() req: JwtRequest,
    @Query('type') type: 'me' | 'other' | 'all',
  ) {
    return this.interestsService.getRejectedInterests(req.user.id, type);
  }
  @Get('accepted')
  async getAccepted(
    @Req() req: JwtRequest,
    @Query('type') type: 'me' | 'other' | 'all',
  ) {
    return this.interestsService.getAcceptedInterests(req.user.id, type);
  }
}
