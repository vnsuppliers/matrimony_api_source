import { IsOptional, IsNumber, IsString } from 'class-validator';

export class ReligiousInfoDto {
  @IsOptional()
  @IsNumber()
  religion_id: number;

  @IsOptional()
  @IsString()
  caste: string;

  @IsOptional()
  @IsString()
  sub_caste: string;

  @IsOptional()
  @IsNumber()
  mother_tongue_id: number;
}
