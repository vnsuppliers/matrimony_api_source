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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SiblingManagementService } from './sibling_management.service';
import { SiblingsInfoDto } from 'src/dto/siblings_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('sibling-management')
export class SiblingManagementController {
  constructor(
    private readonly siblingsManagementService: SiblingManagementService,
  ) {}

  @Post('/update-create')
  async update_create(@Body() body: SiblingsInfoDto & { user_id?: number }) {
    if (!body.user_id) {
      throw new BadRequestException(
        'Unable to attach sibling details layout configuration due to missing user identification parameters.',
      );
    }
    return this.siblingsManagementService.update_create(
      Number(body.user_id),
      body,
    );
  }

  @Delete('/:id')
  async deleteRecord(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException(
        'A valid log entry index token must be assigned to complete deletion operations.',
      );
    }
    return this.siblingsManagementService.deleteRecord(id);
  }
}
