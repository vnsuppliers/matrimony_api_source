import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { InterestsEntity } from 'src/entities/interests.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PresentAddressEntity } from 'src/entities/present_address.entity';
import { ProfessionInfoEntity } from 'src/entities/profession_info.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterestsEntity,
      User,
      PresentAddressEntity,
      ProfessionInfoEntity,
      NotificationEntity,
    ]),
    EmailModule,
  ],
  providers: [InterestsService],
  controllers: [InterestsController],
})
export class InterestsModule {}
