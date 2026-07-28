import { IsString, IsNumber, IsOptional } from 'class-validator';

export class BasicInfoDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsNumber()
  gender_id: number;

  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  @IsNumber()
  marital_status_id?: number;

  @IsOptional()
  @IsNumber()
  is_online?: number;
}
