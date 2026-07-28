import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BasicInfoService } from './basic_info.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { decryptId } from 'src/common/utils/encryption.util';
import { BasicInfoDto } from 'src/dto/basic_info.dto';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

@UseGuards(JwtAuthGuard, AccountStatusGuard)
@Controller('basic-info')
export class BasicInfoController {
  constructor(private readonly basicInfoService: BasicInfoService) {}

  @Get(':user_id')
  public async get_basic_info(@Param('user_id') encryptedId: string) {
    let user_id: number;

    // Check if parameter is directly numeric
    if (!isNaN(Number(encryptedId))) {
      user_id = Number(encryptedId);
    } else {
      try {
        const decrypted = decryptId(encryptedId);
        user_id = Number(decrypted);
        if (isNaN(user_id)) throw new Error();
      } catch {
        throw new BadRequestException('Invalid User ID');
      }
    }

    return this.basicInfoService.get_basic_info(user_id);
  }

  @Post('/update-create/:user_id')
  public async update_create_basic_info(
    @Param('user_id') incomingId: string,
    @Body() dto: BasicInfoDto,
  ) {
    let user_id: number;

    if (!isNaN(Number(incomingId))) {
      user_id = Number(incomingId);
    } else {
      // Otherwise, decrypt it like normal
      try {
        const decrypted = decryptId(incomingId);
        user_id = Number(decrypted);
        if (isNaN(user_id)) throw new Error();
      } catch {
        throw new BadRequestException(
          'Invalid User ID format during update mutation',
        );
      }
    }

    return this.basicInfoService.update_create_basic_info(user_id, dto);
  }
}
