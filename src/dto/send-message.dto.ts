import { IsNotEmpty, IsNumber } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  chat_id: number;

  @IsNotEmpty()
  message: string;
}
