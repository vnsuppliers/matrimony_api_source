import { Module } from '@nestjs/common';
import { PresentaddressManagementService } from './presentaddress_management.service';
import { PresentaddressManagementController } from './presentaddress_management.controller';
import { PresentAddressEntity } from 'src/entities/present_address.entity';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, PresentAddressEntity])],
  providers: [PresentaddressManagementService],
  controllers: [PresentaddressManagementController],
})
export class PresentaddressManagementModule {}
