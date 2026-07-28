import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAstronomicInfoDto {
  @IsOptional()
  id?: any;

  @IsOptional()
  user_id?: any;

  @IsOptional()
  @IsInt()
  zodiac_sign?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  moon_sign?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  padam?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  place_of_birth?: string;

  @IsOptional()
  @IsString()
  time_of_birth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  gothram?: string;

  @IsOptional()
  @IsString()
  astro_notes?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
