import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  user_id: number;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsInt()
  status?: number;
}
