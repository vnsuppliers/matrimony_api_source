import { Test, TestingModule } from '@nestjs/testing';
import { ProfileGalleryService } from './profile_gallery.service';

describe('ProfileGalleryService', () => {
  let service: ProfileGalleryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileGalleryService],
    }).compile();

    service = module.get<ProfileGalleryService>(ProfileGalleryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
