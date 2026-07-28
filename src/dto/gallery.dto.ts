import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GalleryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  id?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  user_id?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  status?: number;

  @IsOptional()
  @IsString()
  image_url?: string;

  // Make this optional and accept any incoming input during file intercept validation
  @IsOptional()
  gallery_images?: string | string[];
}
