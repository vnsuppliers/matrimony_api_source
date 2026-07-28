import { Module } from '@nestjs/common';
import { PresentAddressService } from './present_address.service';
import { PresentAddressController } from './present_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PresentAddressEntity } from 'src/entities/present_address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PresentAddressEntity])],
  providers: [PresentAddressService],
  controllers: [PresentAddressController],
})
export class PresentAddressModule {}
