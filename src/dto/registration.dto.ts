import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  last_name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  address_line1?: string;

  @IsOptional()
  @IsString()
  address_line2?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  country_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  state_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  city_id?: number;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gender_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  religion_id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  mother_tongue_id?: number;

  @IsOptional()
  date_of_birth?: Date;
}
