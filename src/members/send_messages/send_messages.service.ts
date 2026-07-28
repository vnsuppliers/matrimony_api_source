import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from '../../entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { ChatEntity } from 'src/entities/chats.entity';
import { ChatParticipantEntity } from 'src/entities/chat_participants.entity';
import { MessageEntity } from 'src/entities/messages.entity';

@Injectable()
export class SendMessagesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MemberEntity)
    private readonly memberRepo: Repository<MemberEntity>,

    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,

    @InjectRepository(ChatParticipantEntity)
    private readonly participantRepo: Repository<ChatParticipantEntity>,

    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  // THREAD LIST
  async getMessagesByGender(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['members'],
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.is_verified !== 1) {
      throw new ForbiddenException(
        user.account_status_message || 'Access Denied.',
      );
    }

    const member = user.members?.[0];
    if (!member) throw new NotFoundException('Member not found');

    // Only load target chat participants who are active/verified
    return this.memberRepo.find({
      where: {
        user_id: Not(userId),
        user: { is_verified: 1 }, // 🔥 Filter out unverified/suspended accounts
      },
      relations: ['user', 'religion_master'],
    });
  }

  // GET OR CREATE CHAT
  async getOrCreateChat(userId: number, otherUserId: number) {
    const me = await this.userRepo.findOne({ where: { id: userId } });
    if (!me || me.is_verified !== 1) {
      throw new ForbiddenException(
        me?.account_status_message || 'Access Denied.',
      );
    }

    const chat = await this.chatRepo
      .createQueryBuilder('chat')
      .innerJoin('chat.participants', 'p1')
      .innerJoin('chat.participants', 'p2')
      .leftJoinAndSelect('chat.participants', 'p3')
      .leftJoinAndSelect('p3.user', 'user')
      .where('p1.user_id = :userId', { userId })
      .andWhere('p2.user_id = :otherUserId', { otherUserId })
      .getOne();

    if (chat) return chat;

    const newChat = await this.chatRepo.save(this.chatRepo.create());
    await this.participantRepo.save([
      { chat: newChat, user: { id: userId } },
      { chat: newChat, user: { id: otherUserId } },
    ]);

    return this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'p')
      .leftJoinAndSelect('p.user', 'user')
      .where('chat.id = :id', { id: newChat.id })
      .getOne();
  }

  // GET MESSAGES
  async getMessages(chatId: number) {
    return this.messageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.chat_id = :chatId', { chatId })
      .select([
        'message.id',
        'message.message',
        'message.is_read',
        'message.created_at',
        'sender.id',
        'sender.first_name',
        'sender.last_name',
      ])
      .orderBy('message.created_at', 'ASC')
      .getMany();
  }

  // SEND MESSAGE
  async sendMessage(chatId: number, senderId: number, message: string) {
    const me = await this.userRepo.findOne({ where: { id: senderId } });
    if (!me || me.is_verified !== 1) {
      throw new ForbiddenException(
        me?.account_status_message || 'Access Denied.',
      );
    }

    const msg = this.messageRepo.create({
      chat: { id: chatId },
      sender: { id: senderId },
      message,
    });

    const saved = await this.messageRepo.save(msg);

    return this.messageRepo.findOne({
      where: { id: saved.id },
      relations: ['sender'],
    });
  }
}
