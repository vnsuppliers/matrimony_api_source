import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PermanentAddressDto {
  @IsOptional()
  id?: any;

  @IsOptional()
  user_id?: any;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  country_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  state_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  city_id: number;

  @IsOptional()
  @IsString()
  address_line1: string;

  @IsOptional()
  @IsString()
  address_line2: string;

  @IsOptional()
  @IsString()
  pincode: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;
}
