import { Test, TestingModule } from '@nestjs/testing';
import { ProfileGalleryController } from './profile_gallery.controller';

describe('ProfileGalleryController', () => {
  let controller: ProfileGalleryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileGalleryController],
    }).compile();

    controller = module.get<ProfileGalleryController>(ProfileGalleryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
