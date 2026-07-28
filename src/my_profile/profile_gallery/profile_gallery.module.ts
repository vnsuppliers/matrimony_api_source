import { Module } from '@nestjs/common';
import { ProfileGalleryService } from './profile_gallery.service';
import { ProfileGalleryController } from './profile_gallery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { GalleryEntity } from 'src/entities/gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GalleryEntity])],
  providers: [ProfileGalleryService],
  controllers: [ProfileGalleryController],
})
export class ProfileGalleryModule {}
