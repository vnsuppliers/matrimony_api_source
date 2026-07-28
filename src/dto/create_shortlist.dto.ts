import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShortlistDto {
  @IsNumber()
  @IsNotEmpty()
  shortlisted_to: number;
}
