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

import { PresentAddressService } from './present_address.service';
import { PresentAddressDto } from 'src/dto/present_address.dto';

@UseGuards(JwtAuthGuard)
@Controller('present-address')
export class PresentAddressController {
  constructor(private readonly presentAddressService: PresentAddressService) {}

  // ================= GET =================
  @Get('/:user_id')
  public async getPresentAddress(@Param('user_id') incomingId: string) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.presentAddressService.get_present_address_by_user_id(user_id);
  }

  // ================= UPSERT =================
  @Post('/update-create/:user_id')
  public async create_update_present_address(
    @Param('user_id') incomingId: string,
    @Body() dto: PresentAddressDto,
  ) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.presentAddressService.update_create_present_address(
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
      // Decode URL encoding first before decrypting (safe default for your public profile routing)
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
