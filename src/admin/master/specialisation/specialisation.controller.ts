import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SpecialisationService } from './specialisation.service';

@UseGuards(JwtAuthGuard)
@Controller('master/specialisation')
export class SpecialisationController {
  constructor(private readonly specialisationService: SpecialisationService) {}

  @Get('/get_specialisations/:educationId')
  public async get_specialisations(@Param('educationId') educationId: number) {
    return await this.specialisationService.get_specialisations(
      Number(educationId),
    );
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
    return await this.specialisationService.get_specialisation_master_data(
      targetPage,
      targetLimit,
    );
  }

  @Post('/update-create')
  async updateCreateSpecialisation(
    @Query('id') id: string,
    @Body() payload: { name: string; status: number; educationId: number },
  ) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.specialisationService.update_create(targetId, payload);
  }

  @Post('/delete-specialisation')
  async deleteSpecialisation(@Query('id') id: string) {
    const targetId = id ? parseInt(id, 10) : 0;
    return await this.specialisationService.delete_master_data(targetId);
  }
}
