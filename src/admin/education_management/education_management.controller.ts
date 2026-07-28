import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EducationManagementService } from './education_management.service';

@UseGuards(JwtAuthGuard)
@Controller('education-management')
export class EducationManagementController {
  constructor(private readonly eduService: EducationManagementService) {}

  @Post('/update-create')
  async update_create(@Req() req, @Body() body) {
    return this.eduService.update_create(req.user.id, body);
  }

  @Delete('/:id')
  async deleteRecord(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException(
        'A valid record identifier must be provided to perform a deletion.',
      );
    }
    return this.eduService.deleteRecord(id);
  }
}
