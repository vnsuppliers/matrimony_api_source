import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { decryptId } from 'src/common/utils/encryption.util';

import { PermanentAddressService } from './permanent_address.service';
import { PermanentAddressDto } from 'src/dto/permanent_address.dto';

@UseGuards(JwtAuthGuard)
@Controller('permanent-address')
export class PermanentAddressController {
  constructor(
    private readonly permanentAddressService: PermanentAddressService,
  ) {}

  // ================= GET =================
  @Get('/:user_id')
  public async getPermanentAddress(@Param('user_id') incomingId: string) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.permanentAddressService.get_permanent_address_by_user_id(
      user_id,
    );
  }

  // ================= UPSERT =================
  @Post('/update-create/:user_id')
  public async createUpdatePermanentAddress(
    @Param('user_id') incomingId: string,
    @Body() dto: PermanentAddressDto,
  ) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.permanentAddressService.update_create_permanent_address(
      user_id,
      dto,
    );
  }

  // ================= UTIL =================
  private parseOrDecryptUserId(incomingId: string): number {
    // If it's already a clean numeric string from the dashboard (e.g. "3"), parse it directly
    if (!isNaN(Number(incomingId))) {
      return Number(incomingId);
    }

    // Otherwise, treat it as a ciphertext string and attempt decryption
    try {
      // Decode URL encoding first before decrypting
      const decoded = decodeURIComponent(incomingId);
      const decrypted = decryptId(decoded);

      const user_id = Number(decrypted);
      if (isNaN(user_id)) throw new Error();

      return user_id;
    } catch {
      throw new BadRequestException('Invalid User ID');
    }
  }
}
