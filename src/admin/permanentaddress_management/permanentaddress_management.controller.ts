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
import { PermanentaddressManagementService } from './permanentaddress_management.service';
import { PermanentAddressDto } from 'src/dto/permanent_address.dto';

@UseGuards(JwtAuthGuard)
@Controller('permanentaddress-management')
export class PermanentaddressManagementController {
  constructor(
    private readonly permanentAddressmanagementService: PermanentaddressManagementService,
  ) {}

  @Post('/update-create')
  async update_create(
    @Body() body: PermanentAddressDto & { user_id?: number },
  ) {
    if (!body.user_id) {
      throw new BadRequestException(
        'The user_id field targeting the profile is required in the request body.',
      );
    }

    return this.permanentAddressmanagementService.update_create(
      Number(body.user_id),
      body,
    );
  }

  @Delete('/delete/:id')
  async deleteAddress(@Param('id', ParseIntPipe) id: number) {
    return this.permanentAddressmanagementService.deleteAddress(id);
  }
}
