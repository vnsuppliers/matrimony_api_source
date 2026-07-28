import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfessionInfoService } from './profession_info.service';
import { decryptId } from 'src/common/utils/encryption.util';
import { CreateUpdateProfessionInfoDto } from 'src/dto/create_update_profession_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('profession_info')
export class ProfessionInfoController {
  constructor(private readonly service: ProfessionInfoService) {}

  // SMART PARSER: Safely reads plain numeric IDs OR encrypted hash strings
  private parseId(encryptedId: string): number {
    if (!encryptedId || encryptedId === 'undefined' || encryptedId === 'null') {
      throw new BadRequestException('ID parameter is uninitialized or missing');
    }

    // If it's already a direct numeric string (like "3"), use it immediately
    if (!isNaN(Number(encryptedId))) {
      return Number(encryptedId);
    }

    // Otherwise, treat it as a ciphertext token and decrypt it safely
    try {
      const decoded = decodeURIComponent(encryptedId);
      const decrypted = decryptId(decoded);
      const id = Number(decrypted);

      if (isNaN(id)) throw new Error();
      return id;
    } catch {
      throw new BadRequestException('Invalid ID or Ciphertext Structure');
    }
  }

  // ================= GET =================
  @Get('/get/:user_id')
  getProfessionInfoByUserId(
    @Param('user_id')
    encryptedId: string,
  ) {
    const user_id = this.parseId(encryptedId);
    return this.service.get_profession_info(user_id);
  }

  // ================= CREATE =================
  @Post('/create/:user_id')
  createProfessionInfo(
    @Param('user_id')
    encryptedId: string,

    @Body()
    dto: CreateUpdateProfessionInfoDto,
  ) {
    const user_id = this.parseId(encryptedId);
    return this.service.create_profession_info(user_id, dto);
  }

  // ================= UPDATE =================
  @Put('/update/:profession_info_id')
  updateProfessionInfo(
    @Param('profession_info_id')
    encryptedId: string,

    @Body()
    dto: CreateUpdateProfessionInfoDto,
  ) {
    const profession_info_id = this.parseId(encryptedId);
    return this.service.update_profession_info(profession_info_id, dto);
  }

  // ================= DELETE =================
  @Delete('/delete/:profession_info_id')
  deleteProfessionInfo(
    @Param('profession_info_id')
    encryptedId: string,
  ) {
    const profession_info_id = this.parseId(encryptedId);
    return this.service.delete_profession_info(profession_info_id);
  }
}
