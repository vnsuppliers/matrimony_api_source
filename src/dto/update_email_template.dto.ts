import { PartialType } from '@nestjs/swagger';
import { CreateEmailTemplateDto } from './create_email_template.dto';

export class UpdateEmailTemplateDto extends PartialType(
  CreateEmailTemplateDto,
) {}
