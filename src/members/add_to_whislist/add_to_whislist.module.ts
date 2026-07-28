import { Module } from '@nestjs/common';
import { AddToWhislistService } from './add_to_whislist.service';
import { AddToWhislistController } from './add_to_whislist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AddToWhilistEntity } from 'src/entities/add_to_whislist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AddToWhilistEntity])],
  providers: [AddToWhislistService],
  controllers: [AddToWhislistController],
})
export class AddToWhislistModule {}
