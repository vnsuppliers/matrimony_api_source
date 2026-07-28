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
import { AstroManagementService } from './astro_management.service';
import { CreateAstronomicInfoDto } from 'src/dto/astronomic_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('astro-management')
export class AstroManagementController {
  constructor(
    private readonly astroManagementService: AstroManagementService,
  ) {}

  @Post('/update-create')
  async update_create(
    @Body() body: CreateAstronomicInfoDto & { user_id?: number },
  ) {
    // 1. Defensively validate that the admin dashboard passed the target user's ID
    if (!body.user_id) {
      throw new BadRequestException(
        'The user Id field targeting the profile is required in the request body.',
      );
    }

    // 2. Parse the target user ID cleanly to an integer and pass to the service layer
    return this.astroManagementService.update_create(
      Number(body.user_id),
      body,
    );
  }

  @Delete('/delete/:id')
  async deleteAstro(@Param('id', ParseIntPipe) id: number) {
    // 3. Process database entity deletions safely via service mappings
    return this.astroManagementService.deleteAstro(id);
  }
}
