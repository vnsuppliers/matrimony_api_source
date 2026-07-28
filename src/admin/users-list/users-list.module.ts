import { Module } from '@nestjs/common';
import { UsersListService } from './users-list.service';
import { UsersListController } from './users-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersListService],
  controllers: [UsersListController],
})
export class UsersListModule {}
