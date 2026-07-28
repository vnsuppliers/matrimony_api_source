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
import { FamilyInfoDto } from 'src/dto/family_info.dto';
import { FamilyManagementService } from './family_management.service';

@UseGuards(JwtAuthGuard)
@Controller('family-management')
export class FamilyManagementController {
  constructor(private readonly familyService: FamilyManagementService) {}

  @Post('/update-create')
  async update_create(@Body() body: FamilyInfoDto & { user_id?: number }) {
    if (!body.user_id) {
      throw new BadRequestException(
        'Unable to link family details to a valid user identification.',
      );
    }
    return this.familyService.update_create(Number(body.user_id), body);
  }

  @Delete('/user/:userId')
  async deleteByUserId(@Param('userId', ParseIntPipe) userId: number) {
    if (!userId) {
      throw new BadRequestException(
        'A valid profile reference identifier parameter is required.',
      );
    }
    return this.familyService.deleteByUserId(userId);
  }
}
