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
import { SiblingsInfoService } from './siblings_info.service';
import { decryptId } from 'src/common/utils/encryption.util';
import { SiblingsInfoDto } from 'src/dto/siblings_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('siblings-info')
export class SiblingsInfoController {
  constructor(private readonly siblingsInfoService: SiblingsInfoService) {}

  // SMART PARSER: Safely handles plain numeric user/row IDs OR encrypted hash strings
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
  @Get('/:user_id')
  async get_siblings_info_by_user_id(
    @Param('user_id')
    encryptedId: string,
  ) {
    const user_id = this.parseId(encryptedId);
    return this.siblingsInfoService.get_siblings_info_by_user_id(user_id);
  }

  // ================= CREATE =================
  @Post('/create/:user_id')
  async create_siblings_info(
    @Param('user_id')
    encryptedId: string,

    @Body()
    dto: SiblingsInfoDto,
  ) {
    const user_id = this.parseId(encryptedId);
    return this.siblingsInfoService.create_siblings_info(user_id, dto);
  }

  // ================= UPDATE =================
  @Put('/update/:sibling_info_id')
  async update_siblings_info(
    @Param('sibling_info_id')
    encryptedId: string,

    @Body()
    dto: SiblingsInfoDto,
  ) {
    const sibling_info_id = this.parseId(encryptedId);
    return this.siblingsInfoService.update_siblings_info(sibling_info_id, dto);
  }

  // ================= DELETE =================
  @Delete('/delete/:sibling_info_id')
  async delete_siblings_info(
    @Param('sibling_info_id')
    encryptedId: string,
  ) {
    const sibling_info_id = this.parseId(encryptedId);
    return this.siblingsInfoService.delete_siblings_info(sibling_info_id);
  }
}
