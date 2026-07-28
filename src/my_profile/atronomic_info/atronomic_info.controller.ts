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

import { AstronomicInfoService } from '../atronomic_info/atronomic_info.service';
import { CreateAstronomicInfoDto } from 'src/dto/astronomic_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('astro-info')
export class AstronomicInfoController {
  constructor(private readonly astronomicInfoService: AstronomicInfoService) {}

  // ================= GET =================
  @Get('/:user_id')
  public async getAstroInfo(@Param('user_id') incomingId: string) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.astronomicInfoService.get_astro_info_by_user_id(user_id);
  }

  // ================= UPSERT =================
  @Post('/update-create/:user_id')
  public async createUpdateAstroInfo(
    @Param('user_id') incomingId: string,
    @Body() dto: CreateAstronomicInfoDto,
  ) {
    const user_id = this.parseOrDecryptUserId(incomingId);
    return this.astronomicInfoService.update_create_astro_info(user_id, dto);
  }

  // ================= UTIL =================
  private parseOrDecryptUserId(incomingId: string): number {
    // If it's already a clean numeric string from the dashboard (e.g. "3"), parse it directly
    if (!isNaN(Number(incomingId))) {
      return Number(incomingId);
    }

    //  Otherwise, treat it as a ciphertext string and attempt decryption
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
