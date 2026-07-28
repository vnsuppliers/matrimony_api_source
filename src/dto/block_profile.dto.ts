import { IsOptional, IsEnum } from 'class-validator';

export class BlockProfileDto {
  @IsOptional()
  reason?: string;

  @IsOptional()
  @IsEnum(['harassment', 'fake_profile', 'not_interested', 'other'])
  reason_type?: 'harassment' | 'fake_profile' | 'not_interested' | 'other';
}
