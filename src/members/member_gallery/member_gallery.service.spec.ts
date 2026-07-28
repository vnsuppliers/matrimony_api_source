import { Test, TestingModule } from '@nestjs/testing';
import { MemberGalleryService } from './member_gallery.service';

describe('MemberGalleryService', () => {
  let service: MemberGalleryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberGalleryService],
    }).compile();

    service = module.get<MemberGalleryService>(MemberGalleryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
