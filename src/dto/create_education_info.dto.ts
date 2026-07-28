import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEducationInfoDto {
  @IsInt()
  @IsOptional()
  education_id?: number;

  @IsInt()
  @IsOptional()
  specialisation_id?: number;

  @IsString()
  @IsOptional()
  college_name?: string;

  @IsString()
  @IsOptional()
  university_name?: string;

  @IsInt()
  @IsOptional()
  passing_year?: number;

  @IsInt()
  @IsOptional()
  country_id?: number;

  @IsInt()
  @IsOptional()
  state_id?: number;

  @IsInt()
  @IsOptional()
  city_id?: number;

  @IsString()
  @IsOptional()
  education_address?: string;

  @IsInt()
  @IsOptional()
  status?: number;

  @IsInt()
  @IsOptional()
  education_info_status?: number;

  @IsInt()
  @IsOptional()
  is_highest_education?: number;
}
