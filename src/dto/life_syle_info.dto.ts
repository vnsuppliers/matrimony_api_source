import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LifeStyleInfoDto {
  @IsOptional()
  id?: any;
  @IsOptional()
  user_id?: any;

  @IsOptional()
  @IsString()
  diet: string;

  @IsOptional()
  @IsString()
  smoking: string;

  @IsOptional()
  @IsString()
  drinking: string;

  @IsOptional()
  @IsString()
  body_type: string;

  @IsOptional()
  @IsString()
  physical_status: string;

  @IsOptional()
  @IsString()
  fitness_level: string;

  @IsOptional()
  @IsString()
  sleep_habit: string;

  @IsOptional()
  @IsString()
  wake_up_time: string;

  @IsOptional()
  @IsString()
  living_style: string;

  @IsOptional()
  @IsString()
  family_type: string;

  @IsOptional()
  @IsString()
  social_habits: string;

  @IsOptional()
  @IsString()
  travel_habits: string;

  @IsOptional()
  @IsString()
  food_habits: string;

  @IsOptional()
  @IsString()
  fashion_style: string;

  @IsOptional()
  @IsString()
  pet_preference: string;

  @IsOptional()
  @IsString()
  driving_habit: string;

  @IsOptional()
  @IsString()
  work_life_balance: string;

  @IsOptional()
  @IsString()
  religious_life_style: string;

  @IsOptional()
  @IsNumber()
  status: number;
}
