import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

import { Type } from 'class-transformer';

export class CreateUpdateHobbiesInfoDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsInt()
  @IsOptional()
  user_id: number;

  @IsOptional()
  @IsString()
  hobbies: string;

  @IsOptional()
  @IsString()
  interests: string;

  @IsOptional()
  @IsString()
  favorite_music: string;

  @IsOptional()
  @IsString()
  favorite_movies: string;

  @IsOptional()
  @IsString()
  favorite_books: string;

  @IsOptional()
  @IsString()
  sports: string;

  @IsOptional()
  @IsString()
  activities: string;

  @IsOptional()
  @IsString()
  languages_known: string;

  @IsOptional()
  @IsString()
  entertainment_preferences: string;

  @IsOptional()
  @IsString()
  travel_interests: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;
}
