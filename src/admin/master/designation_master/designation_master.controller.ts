import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DesignationMasterService } from './designation_master.service';

@UseGuards(JwtAuthGuard)
@Controller('master/designation_master')
export class DesignationMasterController {
  constructor(
    private readonly designationMasterService: DesignationMasterService,
  ) {}

  // FIXED: profession-based dropdown API
  @Get('/by-profession/:profession_id')
  async getByProfession(@Param('profession_id') profession_id: number) {
    return this.designationMasterService.get_by_profession_id(+profession_id);
  }
}
