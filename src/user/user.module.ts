import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PresentAddressEntity } from 'src/entities/present_address.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { RelativesInfoEntity } from 'src/entities/relatives_info.entity';
import { EmailModule } from 'src/email/email.module';
import { AccountStatusGuard } from 'src/auth/guards/account-status.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      MemberEntity,
      PresentAddressEntity,
      RelativesInfoEntity,
    ]),
    EmailModule,
  ],
  providers: [UserService, AccountStatusGuard],
  controllers: [UserController],
  exports: [UserService, AccountStatusGuard, TypeOrmModule],
})
export class UserModule {}
