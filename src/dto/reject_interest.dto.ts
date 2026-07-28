import { IsNotEmpty, IsString } from 'class-validator';

export class RejectInterestDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
