import { PartialType } from '@nestjs/swagger';
import { CreateSettingsDto } from './create_settings.dto';

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {}
