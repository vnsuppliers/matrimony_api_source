import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfessionMasterService } from './profession_master.service';

@UseGuards(JwtAuthGuard)
@Controller('master/profession_master')
export class ProfessionMasterController {
  constructor(
    private readonly professionMasterService: ProfessionMasterService,
  ) {}

  @Get('/get_profession_master')
  async getProfessionMaster() {
    return await this.professionMasterService.get_profession_master();
  }

  // ==========================================================
  // NEW ENDPOINTS PIPELINES
  // ==========================================================

  @Get('/get_master_data')
  async getMasterData(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const targetPage = page ? parseInt(page, 10) : 1;
    const targetLimit = limit ? parseInt(limit, 10) : 10;
    return await this.professionMasterService.get_profession_master_data(
      targetPage,
      targetLimit,
    );
  }

  @Post('/update-create')
  async updateCreateProfession(
    @Query('id') id: string,
    @Body() payload: { profession_name: string; status: number },
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.professionMasterService.update_create(targetId, payload);
  }

  @Post('/delete-profession')
  async deleteProfession(@Query('id') id: string) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.professionMasterService.delete_master_data(targetId);
  }
}
