import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { decryptId } from 'src/common/utils/encryption.util';

import { LifestyleInfoService } from './lifestyle_info.service';
import { LifeStyleInfoDto } from 'src/dto/life_syle_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('lifestyle-info')
export class LifestyleInfoController {
  constructor(private readonly service: LifestyleInfoService) {}

  // ================= GET =================
  @Get(':user_id')
  async get(@Param('user_id') incomingId: string) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.service.get(user_id);
  }

  // ================= UPSERT =================
  @Post('/update-create/:user_id')
  async createUpdate(
    @Param('user_id') incomingId: string,
    @Body() dto: LifeStyleInfoDto,
  ) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.service.create_update(user_id, dto);
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
