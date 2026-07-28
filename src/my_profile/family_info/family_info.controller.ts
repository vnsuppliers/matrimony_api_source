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
import { FamilyInfoService } from './family_info.service';
import { decryptId } from 'src/common/utils/encryption.util';
import { FamilyInfoDto } from 'src/dto/family_info.dto';

@UseGuards(JwtAuthGuard)
@Controller('family-info')
export class FamilyInfoController {
  constructor(private readonly familyInfoService: FamilyInfoService) {}

  // SMART PARSER: Safely reads plain numeric user IDs OR encrypted hashes
  private parseUserId(incomingId: string): number {
    if (!incomingId || incomingId === 'undefined' || incomingId === 'null') {
      throw new BadRequestException('User ID parameter is missing');
    }

    //  If it's already a direct numeric string (e.g. "3"), parse it directly
    if (!isNaN(Number(incomingId))) {
      return Number(incomingId);
    }

    //  Otherwise, treat it as ciphertext and decrypt it safely
    try {
      const decrypted = decryptId(incomingId);
      const parsedId = Number(decrypted);

      if (isNaN(parsedId)) throw new Error();
      return parsedId;
    } catch {
      throw new BadRequestException('Invalid User ID format');
    }
  }

  @Get('/:user_id')
  public async getFamilyInfo(@Param('user_id') encryptedId: string) {
    const user_id = this.parseUserId(encryptedId);
    return this.familyInfoService.get_famil_info_by_user_id(user_id);
  }

  @Post('/update-create/:user_id')
  public async create_update_family_info(
    @Param('user_id') encryptedId: string,
    @Body() dto: FamilyInfoDto,
  ) {
    const user_id = this.parseUserId(encryptedId);
    return this.familyInfoService.update_create_family_info(user_id, dto);
  }
}
