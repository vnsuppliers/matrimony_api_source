import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddToWhislistService } from './add_to_whislist.service';

interface JwtRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('add-to-whislist')
export class AddToWhislistController {
  constructor(private readonly service: AddToWhislistService) {}

  @Post('add/:whilisted_to')
  async add(
    @Req() req: JwtRequest,
    @Param('whilisted_to') whilisted_to: string,
  ) {
    return this.service.add_to_whilist(req.user.id, parseInt(whilisted_to));
  }

  @Delete('remove/:whilisted_to')
  async remove(
    @Req() req: JwtRequest,
    @Param('whilisted_to') whilisted_to: string,
  ) {
    return this.service.remove_whilist(req.user.id, parseInt(whilisted_to));
  }

  @Get()
  async list(@Req() req: JwtRequest) {
    return this.service.get_whilist(req.user.id);
  }
}
