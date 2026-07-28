import {
  Controller,
  Get,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InterestManagementService } from './interest_management.service';

@UseGuards(JwtAuthGuard)
@Controller('interest-management')
export class InterestManagementController {
  constructor(
    private readonly interestManagementService: InterestManagementService,
  ) {}

  @Get('/get-interest-list')
  async get_interest_list(
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.interestManagementService.get_all_interests(
      Number(page) || 1,
      10,
      search,
    );
  }

  @Get('/sender/:id/interactions')
  async get_sender_interactions(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.interestManagementService.get_sender_interactions(
      id,
      Number(page) || 1,
      10,
      search,
    );
  }

  // Updates status to rejected (2) and saves administrative logs
  @Patch('/:id/reject')
  async reject_user_interest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason: string },
    @Req() req: any, // Extracting authenticating user context payload injected by passport JwtAuthGuard
  ) {
    const adminId = req.user?.id || 1; // Fallback to 1 if testing without mock user context
    return this.interestManagementService.reject_interest(
      id,
      adminId,
      body.reason,
    );
  }

  // Deletes record log completely
  @Delete('/:id/remove')
  async remove_interest(@Param('id', ParseIntPipe) id: number) {
    return this.interestManagementService.delete_interest(id);
  }
}
