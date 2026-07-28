import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SiblingsInfoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  relation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  is_elder?: number;

  @IsOptional()
  @IsString()
  marital_status?: string;

  @IsOptional()
  @IsString()
  educational_qualification?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  spouse_name?: string;

  @IsOptional()
  @IsString()
  spouse_profession?: string;

  @IsOptional()
  @IsString()
  children_count?: string;

  @IsOptional()
  @IsString()
  additional_notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  country_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  state_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  city_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number;
}
