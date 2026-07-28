import {
  Body,
  Controller,
  Post,
  UseGuards,
  BadRequestException,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfessionManagementService } from './profession_management.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUpdateProfessionInfoDto } from 'src/dto/create_update_profession_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('profession-management')
export class ProfessionManagementController {
  constructor(
    private readonly professionService: ProfessionManagementService,
  ) {}

  @Post('/update-create')
  async update_create(
    @Body() body: CreateUpdateProfessionInfoDto & { user_id?: number },
  ) {
    if (!body.user_id) {
      throw new BadRequestException(
        'Unable to link this professional context layout to a valid profile.',
      );
    }

    return this.professionService.update_create(Number(body.user_id), body);
  }

  @Delete('/:id')
  async deleteRecord(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException(
        'A valid record identifier configuration target is required to complete this action.',
      );
    }
    return this.professionService.deleteRecord(id);
  }
}
