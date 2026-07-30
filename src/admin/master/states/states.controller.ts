import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StatesService } from './states.service';

@Controller('master/states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get('/by-country/:countryId')
  async getStates(@Param('countryId') countryId: string) {
    return this.statesService.find_all_by_country(+countryId);
  }


  /**
   * '/get_master_data' is written EXACTLY inside the @Get decorator path string
   * Target URL: GET /master/states/get_master_data
   */
  @Get('/get_master_data')
  async getMasterData(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const targetPage = page ? parseInt(page, 10) : 1;
    const targetLimit = limit ? parseInt(limit, 10) : 10;
    return await this.statesService.get_state_master_data(
      targetPage,
      targetLimit,
    );
  }

  /**
   * Target URL: POST /master/states/update-create
   */
  @Post('/update-create')
  async updateCreateState(
    @Query('id') id: string,
    @Body() payload: { name: string; status: number; countryId: number },
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.statesService.update_create(targetId, payload);
  }

  /**
   * Target URL: POST /master/states/delete-state
   */
  @Post('/delete-state')
  async deleteState(@Query('id') id: string) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.statesService.delete_master_data(targetId);
  }
}
