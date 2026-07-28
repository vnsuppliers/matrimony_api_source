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
import { HobbiesManagementService } from './hobbies_management.service';
import { CreateUpdateHobbiesInfoDto } from 'src/dto/create_update_hobbies_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('hobbies-management')
export class HobbiesManagementController {
  constructor(
    private readonly hobbiesmanagementService: HobbiesManagementService,
  ) {}

  @Post('/update-create')
  async update_create(
    @Body() body: CreateUpdateHobbiesInfoDto & { user_id?: number },
  ) {
    if (!body.user_id) {
      throw new BadRequestException(
        'The user_id field targeting the profile is required in the request body.',
      );
    }

    return this.hobbiesmanagementService.update_create(
      Number(body.user_id),
      body,
    );
  }

  @Delete('/delete/:id')
  async deleteHobbies(@Param('id', ParseIntPipe) id: number) {
    return this.hobbiesmanagementService.deleteHobbies(id);
  }
}
