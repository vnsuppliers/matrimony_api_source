import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUpdateRelativesInfoDto {
  @IsOptional()
  id?: any; // Keeps admin service compilation working perfectly

  @IsOptional()
  user_id?: any; // Prevents strict integer pipe blockers on user side

  @IsOptional()
  @IsString()
  relative_name: string;

  @IsOptional()
  @IsString()
  relation: string;

  @IsOptional()
  @IsString()
  occupation: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  contact_number: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsNumber()
  status: number;
}
