import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlockProfileService } from './block_profile.service';
import { BlockProfileDto } from 'src/dto/block_profile.dto';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

interface JwtRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@UseGuards(JwtAuthGuard, AccountStatusGuard)
@Controller('block-profile')
export class BlockProfileController {
  constructor(private readonly service: BlockProfileService) {}

  @Post('add/:blocked_user_id')
  async block(
    @Req() req: JwtRequest,
    @Param('blocked_user_id') blocked_user_id: string,
    @Body() dto: BlockProfileDto,
  ) {
    return this.service.block(req.user.id, parseInt(blocked_user_id), dto);
  }

  @Delete('remove/:blocked_user_id')
  async unblock(
    @Req() req: JwtRequest,
    @Param('blocked_user_id') blocked_user_id: string,
  ) {
    return this.service.unblock(req.user.id, parseInt(blocked_user_id));
  }

  @Get()
  async list(@Req() req: JwtRequest) {
    return this.service.get_blocked_list(req.user.id);
  }
}
