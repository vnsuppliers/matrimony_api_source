import { Test, TestingModule } from '@nestjs/testing';
import { MemberGalleryController } from './member_gallery.controller';

describe('MemberGalleryController', () => {
  let controller: MemberGalleryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberGalleryController],
    }).compile();

    controller = module.get<MemberGalleryController>(MemberGalleryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
