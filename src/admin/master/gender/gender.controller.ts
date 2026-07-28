import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GenderService } from './gender.service';
import { CreateGenderDto } from 'src/dto/gender_master.dto';

@Controller('master/gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get('/get_genders')
  getall() {
    return this.genderService.getall();
  }

  /**
   * Fetch admin paginated table registry
   * GET /master/gender/get_master_data?page=1&limit=10
   */
  @Get('/get_master_data')
  public async getMasterData(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const targetPage = page ? parseInt(page, 10) : 1;
    const targetLimit = limit ? parseInt(limit, 10) : 10;

    return await this.genderService.get_gender_master_data(
      targetPage,
      targetLimit,
    );
  }

  /**
   * Mutation handler pipeline execution route
   * POST /master/gender/update-create?id=123
   */
  @Post('/update-create')
  public async updateCreateGender(
    @Query('id') id: string,
    @Body() payload: CreateGenderDto,
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.genderService.update_create(targetId, payload);
  }

  /**
   * Destructive structural removal execution query
   * POST /master/gender/delete-gender?id=123
   */
  @Post('/delete-gender')
  public async deleteGender(@Query('id') id: string) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.genderService.delete_master_data(targetId);
  }
}
