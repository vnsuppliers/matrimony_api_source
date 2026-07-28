import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShortlistManagementService } from './shortlist_management.service';

@UseGuards(JwtAuthGuard)
@Controller('shortlist-management')
export class ShortlistManagementController {
  constructor(
    private readonly shortlistManagementService: ShortlistManagementService,
  ) {}

  @Get('/get-shortlist-list')
  async get_shortlist_list(
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.shortlistManagementService.get_all_shortlists(
      Number(page) || 1,
      10,
      search,
    );
  }

  @Get('/sender/:id/targets')
  async get_sender_shortlists(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.shortlistManagementService.get_sender_shortlists(
      id,
      Number(page) || 1,
      10,
      search,
    );
  }

  @Delete('/:id/remove')
  async remove_shortlist(@Param('id', ParseIntPipe) id: number) {
    return this.shortlistManagementService.delete_shortlist(id);
  }
}
