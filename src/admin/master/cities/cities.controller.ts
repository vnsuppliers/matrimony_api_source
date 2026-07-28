import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('master/cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('/by-state/:stateId')
  find_by_state(@Param('stateId') stateId: number) {
    return this.citiesService.find_by_state(+stateId);
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
    return await this.citiesService.get_city_master_data(
      targetPage,
      targetLimit,
    );
  }

  @Post('/update-create')
  async updateCreateCity(
    @Query('id') id: string,
    @Body() payload: { name: string; stateId: number },
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.citiesService.update_create(targetId, payload);
  }

  @Post('/delete-city')
  async deleteCity(@Query('id') id: string) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.citiesService.delete_master_data(targetId);
  }
}
