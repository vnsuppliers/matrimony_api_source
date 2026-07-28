import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EducationService } from './education.service';

@UseGuards(JwtAuthGuard)
@Controller('master/education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get('/get_education')
  public async get_education() {
    return await this.educationService.get_education();
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
    return await this.educationService.get_education_master_data(
      targetPage,
      targetLimit,
    );
  }

  @Post('/update-create')
  async updateCreateEducation(
    @Query('id') id: string,
    @Body() payload: { name: string; status: number },
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.educationService.update_create(targetId, payload);
  }

  @Post('/delete-education')
  async deleteEducation(@Query('id') id: string) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.educationService.delete_master_data(targetId);
  }
}
