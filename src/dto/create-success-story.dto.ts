import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSuccessStoryDto {
  @IsString()
  @IsNotEmpty()
  groom_name: string;

  @IsString()
  @IsNotEmpty()
  bride_name: string;

  @IsString()
  @IsNotEmpty()
  marriage_date: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsOptional()
  @IsString()
  image?: string;
}
