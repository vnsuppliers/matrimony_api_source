import { Test, TestingModule } from '@nestjs/testing';
import { GalleryManagementService } from './gallery_management.service';

describe('GalleryManagementService', () => {
  let service: GalleryManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalleryManagementService],
    }).compile();

    service = module.get<GalleryManagementService>(GalleryManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
