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
import { ReligiousInfoService } from './religious_info.service';
import { ReligiousInfoDto } from 'src/dto/religious_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('religious-info')
export class ReligiousInfoController {
  constructor(private readonly religiousInfoService: ReligiousInfoService) {}

  // GET RELIGIOUS INFO
  @Get(':user_id')
  public async get_religious_info(@Param('user_id') encryptedId: string) {
    let user_id: number;

    //  SMART CHECK: If it is already a direct numeric string (like "3"), use it directly!
    if (!isNaN(Number(encryptedId))) {
      user_id = Number(encryptedId);
    } else {
      // Otherwise, decrypt it like normal
      try {
        const decrypted = decryptId(encryptedId);
        user_id = Number(decrypted);

        if (isNaN(user_id)) throw new Error();
      } catch {
        throw new BadRequestException('Invalid User ID');
      }
    }

    return this.religiousInfoService.get_religious_info(user_id);
  }

  // UPDATE / CREATE RELIGIOUS INFO
  @Post('/update-create/:user_id')
  public async update_create_religious_info(
    @Param('user_id') encryptedId: string,
    @Body() dto: ReligiousInfoDto,
  ) {
    let user_id: number;

    // SMART CHECK: Support both numeric values and ciphertext structures on mutations
    if (!isNaN(Number(encryptedId))) {
      user_id = Number(encryptedId);
    } else {
      try {
        const decrypted = decryptId(encryptedId);
        user_id = Number(decrypted);

        if (!user_id || isNaN(user_id)) {
          throw new Error();
        }
      } catch {
        throw new BadRequestException('Invalid User ID');
      }
    }

    return this.religiousInfoService.update_create_religious_info(user_id, dto);
  }
}
