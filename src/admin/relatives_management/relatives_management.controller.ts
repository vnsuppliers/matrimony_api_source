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
import { RelativesManagementService } from './relatives_management.service';
import { CreateUpdateRelativesInfoDto } from 'src/dto/create_update_relatives_info.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('relatives-management')
export class RelativesManagementController {
  constructor(
    private readonly relativesManagementService: RelativesManagementService,
  ) {}

  @Post('update-create')
  async update_create(
    @Body() body: CreateUpdateRelativesInfoDto & { user_id?: number },
  ) {
    if (!body.user_id) {
      throw new BadRequestException(
        'Defensive context configuration parameters are failing due to a missing user_id.',
      );
    }

    return this.relativesManagementService.update_create(
      Number(body.user_id),
      body,
    );
  }

  @Delete('/:id')
  async deleteRecord(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException(
        'An indexing identifier parameter payload is strictly required to execute clear commands.',
      );
    }
    return this.relativesManagementService.deleteRecord(id);
  }
}
