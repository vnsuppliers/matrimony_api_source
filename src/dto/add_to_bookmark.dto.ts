import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToBookmarkDto {
  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @IsNotEmpty()
  @IsNumber()
  receiver_id: number;
}
