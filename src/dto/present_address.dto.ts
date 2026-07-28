import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PresentAddressDto {
  @IsOptional()
  id?: any;

  @IsOptional()
  user_id: any;

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
  address_line1: string;

  @IsOptional()
  address_line2: string;

  @IsOptional()
  pincode: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;
}
