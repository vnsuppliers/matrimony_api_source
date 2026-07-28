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
import { EducationInfoService } from './education_info.service';
import { CreateEducationInfoDto } from 'src/dto/create_education_info.dto';
import { decryptId } from 'src/common/utils/encryption.util';

@UseGuards(JwtAuthGuard)
@Controller('education-info')
export class EducationInfoController {
  constructor(private readonly service: EducationInfoService) {}

  // Intelligently reads plain numeric user IDs OR encrypted hashes
  private parseUserId(incomingId: string): number {
    if (!incomingId || incomingId === 'undefined' || incomingId === 'null') {
      throw new BadRequestException('User ID parameter is missing');
    }

    // If it's already a direct numeric string (e.g. "3"), parse it directly
    if (!isNaN(Number(incomingId))) {
      return Number(incomingId);
    }

    // Otherwise, treat it as ciphertext and decrypt it safely
    try {
      const decoded = decodeURIComponent(incomingId);
      const decrypted = decryptId(decoded);
      const parsedId = Number(decrypted);

      if (isNaN(parsedId)) throw new Error();
      return parsedId;
    } catch {
      throw new BadRequestException('Invalid Encrypted User ID Structure');
    }
  }

  // education_id remains a plain number as designed
  private parseEducationId(rawId: string): number {
    const id = Number(rawId);
    if (isNaN(id)) throw new BadRequestException('Invalid Education ID');
    return id;
  }

  // GET ALL — user_id can now be plain OR encrypted
  @Get(':user_id')
  getAll(@Param('user_id') encryptedId: string) {
    const user_id = this.parseUserId(encryptedId);
    return this.service.get_education_info(user_id);
  }

  // CREATE — user_id can now be plain OR encrypted
  @Post(':user_id')
  create(
    @Param('user_id') encryptedId: string,
    @Body() dto: CreateEducationInfoDto,
  ) {
    const user_id = this.parseUserId(encryptedId);
    return this.service.create_education_info(user_id, dto);
  }

  // UPDATE — education_id is plain number
  @Put(':education_id')
  update(
    @Param('education_id') rawId: string,
    @Body() dto: CreateEducationInfoDto,
  ) {
    const education_id = this.parseEducationId(rawId);
    return this.service.update_education_info(education_id, dto);
  }

  // DELETE — education_id is plain number
  @Delete(':education_id')
  remove(@Param('education_id') rawId: string) {
    const education_id = this.parseEducationId(rawId);
    return this.service.delete_education_info(education_id);
  }
}
