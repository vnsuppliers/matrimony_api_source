import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FamilyInfoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsString()
  @IsOptional()
  father_name?: string;

  @IsString()
  @IsOptional()
  father_occupation?: string;

  @IsString()
  @IsOptional()
  father_education?: string;

  @IsString()
  @IsOptional()
  father_status?: string;

  @IsString()
  @IsOptional()
  mother_name?: string;

  @IsString()
  @IsOptional()
  mother_occupation?: string;

  @IsString()
  @IsOptional()
  mother_education?: string;

  @IsString()
  @IsOptional()
  mother_status?: string;

  @IsString()
  @IsOptional()
  family_type?: string; // nuclear / joint / extended

  @IsString()
  @IsOptional()
  family_values?: string; // traditional

  @IsOptional()
  country_id?: number;

  @IsOptional()
  state_id?: number;

  @IsOptional()
  city_id?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  pincode?: number;

  @IsOptional()
  status?: number;
}
