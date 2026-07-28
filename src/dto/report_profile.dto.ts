import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class ReportProfileDto {
  @IsNotEmpty()
  @IsNumber()
  reported_user_id: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  reason: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
