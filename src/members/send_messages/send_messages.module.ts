import { Module } from '@nestjs/common';
import { SendMessagesService } from './send_messages.service';
import { SendMessagesController } from './send_messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/messages.entity';
import { ChatEntity } from 'src/entities/chats.entity';
import { ChatParticipantEntity } from 'src/entities/chat_participants.entity';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
      ChatEntity,
      ChatParticipantEntity,
      User,
      MemberEntity,
    ]),
  ],
  providers: [SendMessagesService],
  controllers: [SendMessagesController],
})
export class SendMessagesModule {}
