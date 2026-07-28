import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MotherTongueService } from './mother_tongue.service';
import { CreateMotherTongueDto } from 'src/dto/mother_tongue_master.dto';

@Controller('master/mother-tongue')
export class MotherTongueController {
  constructor(private readonly motherTongueService: MotherTongueService) {}

  /**
   * Fetches only active mother tongue items (status: 1)
   * Target URL: GET /master/mother-tongue/get_all_mother_tongues
   */
  @Get('/get_all_mother_tongues')
  public async get_all_mother_tongues() {
    return await this.motherTongueService.get_all_mother_tongues();
  }

  /**
   * Fetches all records with pagination limits for the dashboard grid views
   * Target URL: GET /master/mother-tongue/get_master_data?page=1&limit=10
   */
  @Get('/get_master_data')
  public async get_master_data(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const targetPage = page ? parseInt(page, 10) : 1;
    const targetLimit = limit ? parseInt(limit, 10) : 10;

    return await this.motherTongueService.get_master_data(
      targetPage,
      targetLimit,
    );
  }

  /**
   * Dual action pipeline: Creates new records or processes mutations on existing records
   * Target URL: POST /master/mother-tongue/upsert?id=123
   */
  @Post('/update-create')
  public async update_create_mother_tongue(
    @Query('id') id: string, // Accept optional query parameter
    @Body() payload: CreateMotherTongueDto,
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.motherTongueService.update_create_master_data(
      targetId,
      payload,
    );
  }

  /***
   * Delete mother tongue
   */
  @Post('/delete-mother-tongue')
  public async delete_mother_tongue(@Query('id', ParseIntPipe) id: number) {
    return this.motherTongueService.delete_master_data(id);
  }
}
