import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LifestyleManagementService } from './lifestyle_management.service';
import { LifeStyleInfoDto } from 'src/dto/life_syle_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('lifestyle-management')
export class LifestyleManagementController {
  constructor(
    private readonly lifeStyleManagementService: LifestyleManagementService,
  ) {}

  @Post('/update-create')
  async update_create(@Body() body: LifeStyleInfoDto & { user_id?: number }) {
    if (!body.user_id) {
      throw new BadRequestException(
        'The user id field targeting the profile is required in the request body.',
      );
    }

    return this.lifeStyleManagementService.update_create(
      Number(body.user_id),
      body,
    );
  }

  @Delete('/delete/:id')
  async deleteLifestyle(@Param('id', ParseIntPipe) id: number) {
    return this.lifeStyleManagementService.deleteLifestyle(id);
  }
}
