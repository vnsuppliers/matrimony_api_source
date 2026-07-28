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
import { decryptId } from 'src/common/utils/encryption.util';
import { CreateUpdateRelativesInfoDto } from 'src/dto/create_update_relatives_info.dto';
import { RelativesInfoService } from './relatives_info.service';

@UseGuards(JwtAuthGuard)
@Controller('relatives-info')
export class RelativesInfoController {
  constructor(private readonly relativesService: RelativesInfoService) {}

  // SMART PARSER: Safely reads plain numeric user/row IDs OR encrypted hash tokens
  private parseId(encryptedId: string): number {
    if (!encryptedId || encryptedId === 'undefined' || encryptedId === 'null') {
      throw new BadRequestException('ID parameter is uninitialized or missing');
    }

    //  If it's already a direct numeric string (like "3"), use it directly
    if (!isNaN(Number(encryptedId))) {
      return Number(encryptedId);
    }

    //  Otherwise, treat it as a ciphertext token and decrypt it safely
    try {
      const decoded = decodeURIComponent(encryptedId);
      const decrypted = decryptId(decoded);
      const id = Number(decrypted);

      if (isNaN(id)) throw new Error();
      return id;
    } catch {
      throw new BadRequestException(
        'Invalid ID format or Ciphertext Structure',
      );
    }
  }

  @Get('/get/:user_id')
  getRelativesInfo(@Param('user_id') encryptedId: string) {
    const user_id = this.parseId(encryptedId);
    return this.relativesService.get_relatives_info(user_id);
  }

  @Post('/create/:user_id')
  createRelativesInfo(
    @Param('user_id') encryptedId: string,
    @Body() dto: CreateUpdateRelativesInfoDto,
  ) {
    const user_id = this.parseId(encryptedId);
    return this.relativesService.create_relatives_info(user_id, dto);
  }

  @Put('/update/:relatives_info_id')
  updateRelativesInfo(
    @Param('relatives_info_id') encryptedId: string,
    @Body() dto: CreateUpdateRelativesInfoDto,
  ) {
    const relatives_info_id = this.parseId(encryptedId);
    return this.relativesService.update_relatives_info(relatives_info_id, dto);
  }

  @Delete('/delete/:relatives_info_id')
  deleteRelativesInfo(@Param('relatives_info_id') encryptedId: string) {
    const relatives_info_id = this.parseId(encryptedId);
    return this.relativesService.delete_relatives_info(relatives_info_id);
  }
}
