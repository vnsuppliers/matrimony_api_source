import { Module } from '@nestjs/common';
import { PermanentaddressManagementService } from './permanentaddress_management.service';
import { PermanentaddressManagementController } from './permanentaddress_management.controller';
import { User } from 'src/entities/user.entity';
import { PermanentAddressEntity } from 'src/entities/permanent_address_info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PermanentAddressEntity, User])],
  providers: [PermanentaddressManagementService],
  controllers: [PermanentaddressManagementController],
})
export class PermanentaddressManagementModule {}
