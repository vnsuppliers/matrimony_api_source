import { Module } from '@nestjs/common';
import { PermanentAddressService } from './permanent_address.service';
import { PermanentAddressController } from './permanent_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PermanentAddressEntity } from 'src/entities/permanent_address_info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PermanentAddressEntity])],
  providers: [PermanentAddressService],
  controllers: [PermanentAddressController],
})
export class PermanentAddressModule {}
