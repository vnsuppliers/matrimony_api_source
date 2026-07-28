import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGenderDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  status!: number;
}
