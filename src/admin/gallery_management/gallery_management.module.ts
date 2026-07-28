import { Module } from '@nestjs/common';
import { GalleryManagementService } from './gallery_management.service';
import { GalleryManagementController } from './gallery_management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { GalleryEntity } from 'src/entities/gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GalleryEntity])],
  providers: [GalleryManagementService],
  controllers: [GalleryManagementController],
})
export class GalleryManagementModule {}
