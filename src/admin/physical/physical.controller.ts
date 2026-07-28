import {
  Body,
  Controller,
  UseGuards,
  BadRequestException,
  Post,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PhysicalService } from './physical.service';
import { CreateUpdatePhysicalAttributesDto } from 'src/dto/create_update_physical_attributes.dto';

@UseGuards(JwtAuthGuard)
@Controller('physical')
export class PhysicalController {
  constructor(private readonly service: PhysicalService) {}

  @Post('update-create')
  updateCreate(@Body() body: CreateUpdatePhysicalAttributesDto) {
    if (!body.user_id) {
      throw new BadRequestException(
        'Unable to match this operation to a valid user identification tag.',
      );
    }

    return this.service.update_create(body.user_id, body);
  }

  @Delete('user/:userId')
  deleteByUser(@Param('userId', ParseIntPipe) userId: number) {
    if (!userId) {
      throw new BadRequestException(
        'A valid user identification number must be specified for removal.',
      );
    }

    return this.service.deleteByUserId(userId);
  }
}
