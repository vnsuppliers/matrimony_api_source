import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VisitorManagementService } from './visitor_management.service';

@UseGuards(JwtAuthGuard)
@Controller('visitor-management')
export class VisitorManagementController {
  constructor(
    private readonly visitorManagementService: VisitorManagementService,
  ) {}

  @Get('/get-visited-list')
  async get_visited_list(
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.visitorManagementService.get_all_visited_profiles(
      Number(page) || 1,
      10,
      search,
    );
  }

  @Get('/profile/:id/visitors')
  async get_profile_visitors(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.visitorManagementService.get_profile_visitors_list(
      id,
      Number(page) || 1,
      10,
      search,
    );
  }
}
