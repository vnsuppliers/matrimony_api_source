import { PartialType } from '@nestjs/swagger';
import { CreateTermsConditionsDto } from './create-terms-conditions.dto';

export class UpdateTermsConditionsDto extends PartialType(CreateTermsConditionsDto) {}