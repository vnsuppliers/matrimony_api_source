import {
  Controller,
  Get,
  Patch,
  Delete,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlockManagementService } from './block_management.service';

@UseGuards(JwtAuthGuard)
@Controller('block-management')
export class BlockManagementController {
  constructor(
    private readonly blockManagementService: BlockManagementService,
  ) {}

  @Get('/get-block-list')
  async get_block_list(
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.blockManagementService.get_all_blocks(
      Number(page) || 1,
      10,
      search,
    );
  }

  @Get('/blocker/:id/targets')
  async get_blocker_targets(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    return this.blockManagementService.get_blocker_targets(
      id,
      Number(page) || 1,
      10,
      search,
    );
  }

  @Patch('/:id/unblock')
  async lift_user_block(@Param('id', ParseIntPipe) id: number) {
    return this.blockManagementService.lift_block(id);
  }

  @Delete('/:id/remove')
  async purge_block_row(@Param('id', ParseIntPipe) id: number) {
    return this.blockManagementService.delete_block_log(id);
  }
}
