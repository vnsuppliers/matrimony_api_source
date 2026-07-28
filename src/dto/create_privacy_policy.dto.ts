import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePrivacyPolicyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
