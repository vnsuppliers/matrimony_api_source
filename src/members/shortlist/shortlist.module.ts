import { Module } from '@nestjs/common';
import { ShortlistService } from './shortlist.service';
import { ShortlistController } from './shortlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortlistEntity } from 'src/entities/shortlist.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { EmailModule } from 'src/email/email.module';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortlistEntity, NotificationEntity, User]),
    EmailModule,
  ],
  providers: [ShortlistService, AccountStatusGuard],
  controllers: [ShortlistController],
})
export class ShortlistModule {}
