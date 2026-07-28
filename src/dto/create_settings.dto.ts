import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  app_name: string;

  @IsOptional()
  @IsString()
  app_logo?: string;

  @IsOptional()
  @IsEmail()
  app_email?: string;

  @IsOptional()
  @IsString()
  app_phone?: string;

  @IsOptional()
  @IsString()
  app_address?: string;

  @IsOptional()
  @IsString()
  app_website?: string;

  @IsOptional()
  @IsString()
  smtp_host?: string;

  @IsOptional()
  @IsNumber()
  smtp_port?: number;

  @IsOptional()
  @IsString()
  smtp_username?: string;

  @IsOptional()
  @IsString()
  smtp_password?: string;

  @IsOptional()
  @IsString()
  smtp_encryption?: string;

  @IsOptional()
  @IsString()
  smtp_from_name?: string;

  @IsOptional()
  @IsEmail()
  smtp_from_email?: string;

  @IsOptional()
  @IsEmail()
  support_email?: string;

  @IsOptional()
  @IsString()
  facebook_url?: string;

  @IsOptional()
  @IsString()
  instagram_url?: string;

  @IsOptional()
  @IsString()
  twitter_url?: string;

  @IsOptional()
  @IsString()
  linkedin_url?: string;

  @IsOptional()
  @IsString()
  youtube_url?: string;

  @IsOptional()
  @IsString()
  primary_color?: string;

  @IsOptional()
  @IsString()
  secondary_color?: string;

  @IsOptional()
  @IsString()
  copyright_text?: string;
}
