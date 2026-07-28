import {
  Controller,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddToBookmarksService } from './add_to_bookmarks.service';

interface JwtRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('add-to-bookmarks')
export class AddToBookmarksController {
  constructor(private readonly service: AddToBookmarksService) {}

  @Post(':receiver_id')
  add(@Req() req: JwtRequest, @Param('receiver_id') receiver_id: string) {
    return this.service.add_to_bookmark(req.user.id, parseInt(receiver_id));
  }

  @Delete(':receiver_id')
  remove(@Req() req: JwtRequest, @Param('receiver_id') receiver_id: string) {
    return this.service.remove_bookmark(req.user.id, parseInt(receiver_id));
  }

  @Get()
  list(@Req() req: JwtRequest) {
    return this.service.get_bookmarks(req.user.id);
  }
}
