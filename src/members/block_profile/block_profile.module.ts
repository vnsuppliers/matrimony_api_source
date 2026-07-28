import { Module } from '@nestjs/common';
import { BlockProfileService } from './block_profile.service';
import { BlockProfileController } from './block_profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockProfileEntity } from 'src/entities/block_profile.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockProfileEntity, NotificationEntity, User]),
  ],
  providers: [BlockProfileService],
  controllers: [BlockProfileController],
})
export class BlockProfileModule {}
