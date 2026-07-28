import { Module } from '@nestjs/common';
import { ChatMonitorService } from './chat_monitor.service';
import { ChatMonitorController } from './chat_monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ChatEntity } from 'src/entities/chats.entity';
import { MessageEntity } from 'src/entities/messages.entity';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ChatEntity, MessageEntity, MemberEntity]),
  ],
  providers: [ChatMonitorService],
  controllers: [ChatMonitorController],
})
export class ChatMonitorModule {}
