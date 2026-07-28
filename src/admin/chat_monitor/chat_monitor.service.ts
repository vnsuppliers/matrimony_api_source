import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from 'src/entities/chats.entity';
import { MessageEntity } from 'src/entities/messages.entity';
import { User } from 'src/entities/user.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class ChatMonitorService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  /**
   * Helper utility to process and format profile images matching your exact uploads folder structure
   */
  private formatProfileImage(rawImage: string | null): string | null {
    if (!rawImage) return null;
    return rawImage.startsWith('/api')
      ? rawImage
      : `/api/uploads/profile_pictures/${rawImage}`;
  }

  /**
   * Paginated Unique Senders list with NaN and Postgres type safeguards
   */
  public async get_unique_senders(page: number = 1, limit: number = 10) {
    const safePage = isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = isNaN(limit) || limit < 1 ? 10 : limit;
    const skipAmount = (safePage - 1) * safeLimit;

    const distinctSendersRaw = await this.messageRepo
      .createQueryBuilder('m')
      .select('m.sender_id', 'sender_id')
      .addSelect('COUNT(m.id)', 'msg_count')
      .groupBy('m.sender_id')
      .skip(skipAmount)
      .take(safeLimit)
      .getRawMany();

    const totalCountQuery = await this.messageRepo
      .createQueryBuilder('m')
      .select('COUNT(DISTINCT m.sender_id)', 'cnt')
      .getRawOne<{ cnt: string }>();

    const totalItems = totalCountQuery?.cnt
      ? parseInt(totalCountQuery.cnt, 10)
      : 0;

    const senderIds = distinctSendersRaw
      .map((r) => parseInt(r.sender_id, 10))
      .filter((id) => !isNaN(id));

    if (senderIds.length === 0) {
      return {
        success: true,
        data: [],
        meta: {
          totalItems: 0,
          totalPages: 1,
          currentPage: safePage,
          limit: safeLimit,
        },
      };
    }

    const users = await this.userRepo.find({
      where: { id: In(senderIds) },
      relations: ['members'],
    });

    const data = distinctSendersRaw
      .map((row) => {
        const parsedSenderId = parseInt(row.sender_id, 10);
        const user = users.find((u) => u.id === parsedSenderId);
        if (!user) return null;

        const memberRecord =
          user.members && user.members.length > 0 ? user.members[0] : null;

        return {
          id: user.id,
          first_name: user.first_name || 'System',
          last_name: user.last_name || 'User',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          profile_image: this.formatProfileImage(memberRecord?.profile_image),
          total_messages_sent: parseInt(row.msg_count, 10) || 0,
        };
      })
      .filter(Boolean);

    return {
      success: true,
      data,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit) || 1,
        currentPage: safePage,
        limit: safeLimit,
      },
    };
  }

  /**
   * Get all recipients a specific user has interacted with
   */
  public async get_user_chat_recipients(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const safeUserId = isNaN(userId) ? 0 : userId;
    const safePage = isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = isNaN(limit) || limit < 1 ? 10 : limit;
    const skipAmount = (safePage - 1) * safeLimit;

    if (safeUserId === 0) {
      return {
        success: true,
        data: [],
        meta: {
          totalItems: 0,
          totalPages: 1,
          currentPage: safePage,
          limit: safeLimit,
        },
      };
    }

    // 1. Get the total count of chats for this user
    const totalCountQuery = await this.chatRepo
      .createQueryBuilder('c')
      .innerJoin('c.participants', 'cp')
      .where('cp.user_id = :safeUserId', { safeUserId })
      .select('COUNT(DISTINCT c.id)', 'cnt')
      .getRawOne<{ cnt: string }>();

    const totalItems = totalCountQuery?.cnt
      ? parseInt(totalCountQuery.cnt, 10)
      : 0;

    // 2. Fetch the chats, joining all participants, their user information, and member data safely
    const chatRooms = await this.chatRepo
      .createQueryBuilder('c')
      .innerJoin(
        'c.participants',
        'cp_filter',
        'cp_filter.user_id = :safeUserId',
        { safeUserId },
      ) // Ensures target user is in the chat
      .leftJoinAndSelect('c.participants', 'participants') // Load all participants
      .leftJoinAndSelect('participants.user', 'user') // Load user details for participants
      .leftJoinAndSelect('user.members', 'member') // Load profile pictures
      .orderBy('c.updated_at', 'DESC')
      .skip(skipAmount)
      .take(safeLimit)
      .getMany();

    // 3. Map out the details on the opposing participant
    const data = await Promise.all(
      chatRooms.map(async (chat) => {
        // Find the recipient (the participant who is NOT the current logged-in/inspected user)
        const opposingParticipant = chat.participants?.find(
          (p) => p.user && p.user.id !== safeUserId,
        );
        const recipientUser = opposingParticipant?.user;
        const memberRecord =
          recipientUser?.members && recipientUser.members.length > 0
            ? recipientUser.members[0]
            : null;

        // Pull latest message content for preview snippet text
        const latestMsg = await this.messageRepo.findOne({
          where: { chat: { id: chat.id } },
          order: { id: 'DESC' },
        });

        return {
          chat_id: chat.id,
          recipient_id: recipientUser?.id || 0,
          recipient_name: recipientUser
            ? `${recipientUser.first_name} ${recipientUser.last_name}`
            : 'Unknown Recipient',
          recipient_email: recipientUser?.email || 'N/A',
          recipient_image: this.formatProfileImage(memberRecord?.profile_image),
          last_message: latestMsg?.message || '',
          last_message_at: latestMsg?.created_at || chat.updated_at,
        };
      }),
    );

    return {
      success: true,
      data,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit) || 1,
        currentPage: safePage,
        limit: safeLimit,
      },
    };
  }

  /**
   * Chronological messages for chat history logs.
   *
   * IMPORTANT: page 1 must return the MOST RECENT messages (so the chat opens
   * at the bottom of the conversation, like a real chat app), and "load more"
   * must fetch progressively OLDER messages. We do this by querying DESC
   * (newest first) with skip/take, then reversing the page in memory so it's
   * back in chronological ASC order for rendering.
   *
   * We also explicitly select sender.id as a number and guard against a
   * missing/soft-deleted sender so sender_id is never silently undefined.
   */
  public async get_chat_history(
    chatId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const safeChatId = isNaN(chatId) ? 0 : chatId;
    const safePage = isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = isNaN(limit) || limit < 1 ? 10 : limit;
    const skipAmount = (safePage - 1) * safeLimit;

    if (safeChatId === 0) {
      return {
        success: true,
        data: [],
        meta: {
          totalItems: 0,
          totalPages: 1,
          currentPage: safePage,
          limit: safeLimit,
        },
      };
    }

    const [messages, totalItems] = await this.messageRepo.findAndCount({
      where: { chat: { id: safeChatId } },
      relations: ['sender', 'sender.members'],
      order: { id: 'DESC' }, // newest first for correct pagination
      skip: skipAmount,
      take: safeLimit,
    });

    // Reverse this page back to chronological (oldest -> newest) order for display
    const chronologicalPage = [...messages].reverse();

    const data = chronologicalPage.map((m) => {
      const memberRecord =
        m.sender?.members && m.sender.members.length > 0
          ? m.sender.members[0]
          : null;

      // Force a real number (or null if the sender relation genuinely failed
      // to load / user was deleted) so the frontend never compares against undefined.
      const senderId =
        m.sender && typeof m.sender.id === 'number' ? m.sender.id : null;

      return {
        id: m.id,
        sender_id: senderId,
        sender_name: m.sender
          ? `${m.sender.first_name} ${m.sender.last_name}`
          : 'Deleted Account',
        sender_image: this.formatProfileImage(memberRecord?.profile_image),
        message: m.message,
        created_at: m.created_at,
      };
    });

    return {
      success: true,
      data,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit) || 1,
        currentPage: safePage,
        limit: safeLimit,
      },
    };
  }
}
