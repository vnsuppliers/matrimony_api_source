import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShortlistService } from './shortlist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PremiumGuard } from 'src/auth/guards/premium.guard';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

@UseGuards(JwtAuthGuard, PremiumGuard, AccountStatusGuard)
@Controller('shortlist')
export class ShortlistController {
  constructor(private readonly shortlistService: ShortlistService) {}

  @Post(':id')
  add(@Req() req, @Param('id') id: number) {
    return this.shortlistService.add(req.user.id, +id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: number) {
    return this.shortlistService.remove(req.user.id, +id);
  }

  @Get()
  getMy(@Req() req) {
    return this.shortlistService.getMyShortlist(req.user.id);
  }

  @Get('check/:id')
  check(@Req() req, @Param('id') id: number) {
    return this.shortlistService.check(req.user.id, +id);
  }
}
