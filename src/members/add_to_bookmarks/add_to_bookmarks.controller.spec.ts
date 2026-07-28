import { Test, TestingModule } from '@nestjs/testing';
import { AddToBookmarksController } from './add_to_bookmarks.controller';

describe('AddToBookmarksController', () => {
  let controller: AddToBookmarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddToBookmarksController],
    }).compile();

    controller = module.get<AddToBookmarksController>(AddToBookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
