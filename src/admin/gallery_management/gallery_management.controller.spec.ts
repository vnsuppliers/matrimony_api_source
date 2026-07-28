import { Test, TestingModule } from '@nestjs/testing';
import { GalleryManagementController } from './gallery_management.controller';

describe('GalleryManagementController', () => {
  let controller: GalleryManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryManagementController],
    }).compile();

    controller = module.get<GalleryManagementController>(GalleryManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
