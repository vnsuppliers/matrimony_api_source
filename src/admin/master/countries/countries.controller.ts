import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('master/countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('/all')
  async find_all() {
    return this.countriesService.find_all();
  }
  // ==========================================================
  // NEW ENDPOINTS PIPELINES
  // ==========================================================

  /**
   * GET /master/countries/get_master_data?page=1&limit=10
   */
  @Get('/get_master_data')
  async getMasterData(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const targetPage = page ? parseInt(page, 10) : 1;
    const targetLimit = limit ? parseInt(limit, 10) : 10;
    return await this.countriesService.get_country_master_data(
      targetPage,
      targetLimit,
    );
  }

  /**
   * POST /master/countries/update-create?id=0
   */
  @Post('/update-create')
  async updateCreateCountry(
    @Query('id') id: string,
    @Body() payload: { name: string; status: number },
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.countriesService.update_create(targetId, payload);
  }

  /**
   * POST /master/countries/delete-country?id=123
   */
  @Post('/delete-country')
  async deleteCountry(@Query('id') id: string) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.countriesService.delete_master_data(targetId);
  }
}
