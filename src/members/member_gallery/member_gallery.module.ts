import { Module } from '@nestjs/common';
import { MemberGalleryService } from './member_gallery.service';
import { MemberGalleryController } from './member_gallery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { GalleryEntity } from 'src/entities/gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GalleryEntity])],
  providers: [MemberGalleryService],
  controllers: [MemberGalleryController],
})
export class MemberGalleryModule {}
