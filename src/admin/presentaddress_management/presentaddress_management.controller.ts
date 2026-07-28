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
import { PresentAddressDto } from 'src/dto/present_address.dto';
import { PresentaddressManagementService } from './presentaddress_management.service';

@UseGuards(JwtAuthGuard)
@Controller('presentaddress-management')
export class PresentaddressManagementController {
  constructor(
    private readonly presentAddressManagementService: PresentaddressManagementService,
  ) {}

  @Post('/update-create')
  async update_create(@Body() body: PresentAddressDto & { user_id?: number }) {
    if (!body.user_id) {
      throw new BadRequestException(
        'The user id field targeting the profile is required in the request body.',
      );
    }

    return this.presentAddressManagementService.update_create(
      Number(body.user_id),
      body,
    );
  }

  @Delete('/delete/:id')
  async deleteAddress(@Param('id', ParseIntPipe) id: number) {
    return this.presentAddressManagementService.deleteAddress(id);
  }
}
