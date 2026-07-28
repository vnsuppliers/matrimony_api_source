import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUpdatePhysicalAttributesDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  body_type?: string;

  @IsOptional()
  @IsString()
  complexion?: string;

  @IsOptional()
  @IsString()
  physical_status?: string;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsOptional()
  @IsString()
  eye_color?: string;

  @IsOptional()
  @IsString()
  hair_color?: string;

  @IsOptional()
  @IsString()
  hair_type?: string;

  @IsOptional()
  @IsString()
  hair_length?: string;

  @IsOptional()
  @IsString()
  skin_tone?: string;

  @IsOptional()
  @IsString()
  fitness_level?: string;

  @IsOptional()
  @IsString()
  disability?: string;

  @IsOptional()
  @IsString()
  disability_details?: string;

  @IsOptional()
  @IsString()
  spectacles?: string;

  @IsOptional()
  @IsString()
  lens_usage?: string;

  @IsOptional()
  @IsString()
  beard_style?: string;

  @IsOptional()
  @IsString()
  tattoo?: string;

  @IsOptional()
  @IsString()
  physique?: string;

  @IsOptional()
  @IsString()
  shoe_size?: string;

  @IsOptional()
  @IsString()
  dress_size?: string;

  @IsOptional()
  @IsString()
  health_condition?: string;

  @IsOptional()
  @IsString()
  medical_conditions?: string;

  @IsOptional()
  @IsString()
  genetic_disorders?: string;

  @IsOptional()
  @IsString()
  appearance_notes?: string;

  @IsOptional()
  @IsNumber()
  status?: number;
}
